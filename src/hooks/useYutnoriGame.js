import { useState, useMemo, useEffect, useRef } from "react";
import { computeDestinations, buildPath, samePos } from "../game/movement.js";
import { simulateThrow } from "../game/throw.js";
import { freshGame } from "../game/state.js";

// Owns all Yutnori game state: whose turn it is, pending throw results, the
// tile-by-tile hop animation, and the piece-selection/hover UI state. Returns
// everything the board/UI components need plus the handlers that drive them.
export function useYutnoriGame() {
  const [game, setGame] = useState(freshGame);
  const [uid, setUid] = useState(1);
  const [armedRollId, setArmedRollId] = useState(null);
  const [selection, setSelection] = useState(null); // { pIdx, groupIds }
  const [hover, setHover] = useState(null); // { pIdx, groupIds } — piece under the cursor
  const [popup, setPopup] = useState(null); // { key, name, steps, bonus } — center-court throw result
  const popupTimer = useRef(null);
  // Drives the tile-by-tile hop animation. null when nothing is moving.
  // { pIdx, groupIds, waypoints, stepIndex, destOpt, roll, fromPool }
  const [animation, setAnimation] = useState(null);

  useEffect(() => () => clearTimeout(popupTimer.current), []);

  // If the player hasn't manually "armed" a throw result but only has ONE
  // pending roll, use that one automatically — removes the need to tap the
  // chip before tapping a piece in the common case. With 2+ pending rolls
  // (e.g. after a Yut/Mo chain or a catch) the player must tap one to choose.
  const effectiveRollId =
    armedRollId ?? (game.pendingRolls.length === 1 ? game.pendingRolls[0].id : null);

  const destOptions = useMemo(() => {
    if (!selection || effectiveRollId == null) return [];
    const roll = game.pendingRolls.find((r) => r.id === effectiveRollId);
    if (!roll) return [];
    const player = game.players[selection.pIdx];
    const groupPiece = player.pieces.find((p) => p.id === selection.groupIds[0]);
    return computeDestinations(groupPiece, roll.steps);
  }, [selection, effectiveRollId, game]);

  // Hover landing-preview: every route the hovered piece could take with the
  // currently armed roll, each carrying its full tile-by-tile path.
  const hoverRoutes = useMemo(() => {
    if (!hover || effectiveRollId == null || animation) return null;
    const roll = game.pendingRolls.find((r) => r.id === effectiveRollId);
    if (!roll) return null;
    const player = game.players[hover.pIdx];
    const groupPiece = player.pieces.find((p) => p.id === hover.groupIds[0]);
    if (!groupPiece) return null;
    const opts = computeDestinations(groupPiece, roll.steps);
    return opts.map((opt) => ({ opt, waypoints: buildPath(groupPiece, roll.steps, opt) }));
  }, [hover, effectiveRollId, game, animation]);

  function groupsForPlayer(pIdx) {
    const groups = {};
    game.players[pIdx].pieces.forEach((p) => {
      if (p.mode === "start" || p.mode === "home") return;
      const key = `${p.mode}-${p.idx ?? 0}`;
      groups[key] = groups[key] || [];
      groups[key].push(p);
    });
    return Object.values(groups);
  }

  function doThrow() {
    if (!game.canThrow || game.winner || animation) return;
    const result = simulateThrow();
    const roll = { id: "r" + uid, name: result.name, steps: result.steps, bonus: result.bonus };
    setUid((u) => u + 1);
    setGame((g) => ({ ...g, pendingRolls: [...g.pendingRolls, roll], canThrow: result.bonus }));
    setHover(null);

    clearTimeout(popupTimer.current);
    setPopup({ key: roll.id, name: result.name, steps: result.steps, bonus: result.bonus });
    popupTimer.current = setTimeout(() => setPopup(null), 2500);
  }

  function armRoll(id) {
    setArmedRollId((cur) => (cur === id ? null : id));
    setSelection(null);
    setHover(null);
  }

  function onSelectGroup(pIdx, groupIds) {
    if (pIdx !== game.current || effectiveRollId == null || animation) return;
    const roll = game.pendingRolls.find((r) => r.id === effectiveRollId);
    if (!roll) return;
    const player = game.players[pIdx];
    const groupPiece = player.pieces.find((p) => p.id === groupIds[0]);
    const opts = computeDestinations(groupPiece, roll.steps);
    if (opts.length === 1) {
      startAnimatedMove(pIdx, groupIds, opts[0], roll, groupPiece);
    } else {
      setSelection({ pIdx, groupIds });
    }
  }

  function onPieceEnter(pIdx, groupIds) {
    if (pIdx !== game.current || effectiveRollId == null || animation) return;
    setHover({ pIdx, groupIds });
  }
  function onPieceLeave() {
    setHover(null);
  }

  function chooseDestination(opt) {
    if (!selection) return;
    const roll = game.pendingRolls.find((r) => r.id === effectiveRollId);
    if (!roll) return;
    const player = game.players[selection.pIdx];
    const groupPiece = player.pieces.find((p) => p.id === selection.groupIds[0]);
    startAnimatedMove(selection.pIdx, selection.groupIds, opt, roll, groupPiece);
  }

  // Kicks off the tile-by-tile hop animation. The actual game state (catch,
  // stack, win, turn-pass) is only committed once the animation finishes,
  // via finalizeMove — see the useEffect below.
  function startAnimatedMove(pIdx, groupIds, destOpt, roll, originPiece) {
    const waypoints = buildPath(originPiece, roll.steps, destOpt);
    setSelection(null);
    setHover(null);
    setAnimation({
      pIdx,
      groupIds,
      waypoints,
      stepIndex: 0,
      destOpt,
      roll,
      fromPool: originPiece.mode === "start",
    });
  }

  function finalizeMove(pIdx, groupIds, destOpt, roll) {
    setGame((g) => {
      const players = g.players.map((pl) => ({
        ...pl,
        pieces: pl.pieces.map((p) => ({ ...p })),
      }));
      const moving = players[pIdx].pieces.filter((p) => groupIds.includes(p.id));
      moving.forEach((p) => {
        p.mode = destOpt.mode;
        p.idx = destOpt.idx ?? 0;
      });

      let caught = false;
      if (destOpt.mode !== "home") {
        const oppIdx = 1 - pIdx;
        players[oppIdx].pieces.forEach((op) => {
          if (op.mode !== "start" && op.mode !== "home" && samePos(op, moving[0])) {
            op.mode = "start";
            op.idx = 0;
            caught = true;
          }
        });
      }

      const pendingRolls = g.pendingRolls.filter((r) => r.id !== roll.id);
      let canThrow = g.canThrow;
      if (caught) canThrow = true;
      else if (!roll.bonus) canThrow = false;

      let winner = g.winner;
      const homeCount = players[pIdx].pieces.filter((p) => p.mode === "home").length;
      if (homeCount === 4) winner = pIdx + 1;

      let current = g.current;
      if (!winner && !canThrow && pendingRolls.length === 0) {
        current = 1 - pIdx;
        canThrow = true;
      }

      return { ...g, players, pendingRolls, canThrow, winner, current };
    });

    setArmedRollId(null);
    setSelection(null);
  }

  // Step the animation forward one hop at a time; once every waypoint has
  // been shown, commit the real move to game state.
  useEffect(() => {
    if (!animation) return;
    if (animation.stepIndex >= animation.waypoints.length) {
      finalizeMove(animation.pIdx, animation.groupIds, animation.destOpt, animation.roll);
      setAnimation(null);
      return;
    }
    const t = setTimeout(() => {
      setAnimation((a) => (a ? { ...a, stepIndex: a.stepIndex + 1 } : a));
    }, 260);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation]);

  function resetGame() {
    setGame(freshGame());
    setArmedRollId(null);
    setSelection(null);
    setHover(null);
    clearTimeout(popupTimer.current);
    setPopup(null);
  }

  return {
    game,
    armedRollId: effectiveRollId,
    selection,
    hover,
    popup,
    animation,
    destOptions,
    hoverRoutes,
    groupsForPlayer,
    doThrow,
    armRoll,
    onSelectGroup,
    onPieceEnter,
    onPieceLeave,
    chooseDestination,
    resetGame,
  };
}
