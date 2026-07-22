/* =========================================================
   MOVEMENT LOGIC (pure functions, no React state here)
   ========================================================= */
import { CORNERS, DIAGONAL_PARTNER, DIAG_INFO, diagonalPath, centerExitPath, outerCoord } from "./board.js";

// The bottom-left corner (15) is just a regular outer-ring tile where the
// diagonal happens to land — not a checkpoint. Any steps left over after
// reaching it keep going around the outer ring in the same move.
export function afterCorner15(extraSteps) {
  const idx = 15 + extraSteps;
  return idx >= 20 ? { mode: "home" } : { mode: "outer", idx };
}
export function computeDestinations(piece, steps) {
  if (piece.mode === "home") return [];
  if (piece.mode === "start") {
    const newIdx = steps;
    if (newIdx >= 20) return [{ mode: "home", label: "outer" }];
    return [{ mode: "outer", idx: newIdx, label: "outer" }];
  }
  if (piece.mode === "outer") {
    const opts = [];
    const newIdx = piece.idx + steps;
    opts.push(
      newIdx >= 20
        ? { mode: "home", label: "outer" }
        : { mode: "outer", idx: newIdx, label: "outer" }
    );
    // Only the two TOP corners are diagonal decision points.
    if (piece.idx === 5 || piece.idx === 10) {
      const diagMode = "diag" + piece.idx;
      const toCorner = DIAGONAL_PARTNER[piece.idx];
      if (steps === 3) opts.push({ mode: "center", label: "diagonal" });
      else if (steps >= 6)
        opts.push(
          toCorner === 0
            ? { mode: "home", label: "diagonal" }
            : { ...afterCorner15(steps - 6), label: "diagonal" }
        );
      else opts.push({ mode: diagMode, idx: steps, label: "diagonal" });
    }
    return opts;
  }
  if (DIAG_INFO[piece.mode]) {
    const { to: toCorner } = DIAG_INFO[piece.mode];
    const newIdx = piece.idx + steps;
    // Landing exactly on the center stops there; overshooting it does not.
    if (newIdx === 3) return [{ mode: "center" }];
    if (newIdx >= 6) return [toCorner === 0 ? { mode: "home" } : afterCorner15(newIdx - 6)];
    return [{ mode: piece.mode, idx: newIdx }];
  }
  if (piece.mode === "center") {
    // From center the only two continuations are toward home or toward the
    // bottom-left corner — the same pair regardless of which diagonal the
    // piece arrived on (see task spec).
    const homeOpt = steps >= 3 ? { mode: "home", label: "home" } : { mode: "centerHome", idx: steps, label: "home" };
    const downOpt =
      steps >= 3 ? { ...afterCorner15(steps - 3), label: "down" } : { mode: "center15", idx: steps, label: "down" };
    return [homeOpt, downOpt];
  }
  if (piece.mode === "centerHome" || piece.mode === "center15") {
    const toCorner = piece.mode === "centerHome" ? 0 : 15;
    const newIdx = piece.idx + steps;
    if (newIdx >= 3) return [toCorner === 0 ? { mode: "home" } : afterCorner15(newIdx - 3)];
    return [{ mode: piece.mode, idx: newIdx }];
  }
  return [];
}
export function samePos(a, b) {
  if (a.mode !== b.mode) return false;
  if (a.mode === "outer") return a.idx === b.idx;
  if (DIAG_INFO[a.mode]) return a.idx === b.idx;
  if (a.mode === "centerHome" || a.mode === "center15") return a.idx === b.idx;
  if (a.mode === "center") return true;
  return false;
}

// Appends `extraSteps` more outer-ring hop coordinates starting from idx 15
// (bottom-left corner), so a diagonal crossing that overshoots the corner
// keeps hopping in the same animation instead of stopping there.
function pushOuterFrom15(coords, extraSteps) {
  for (let s = 1; s <= extraSteps; s++) {
    const idx = 15 + s;
    if (idx >= 20) { coords.push(CORNERS[0]); return; }
    coords.push(outerCoord(idx));
  }
}

// Builds the list of intermediate hop coordinates (1 per tile) for a move,
// so the piece can visibly hop tile-by-tile instead of teleporting.
// destOpt tells us WHICH branch to follow when a corner offers a choice.
export function buildPath(piece, steps, destOpt) {
  const coords = [];
  if (piece.mode === "start") {
    for (let s = 1; s <= steps; s++) {
      if (s >= 20) { coords.push(CORNERS[0]); break; }
      coords.push(outerCoord(s));
    }
    return coords;
  }
  if (piece.mode === "outer") {
    const isDiagCorner = piece.idx === 5 || piece.idx === 10;
    const takeDiagonal = isDiagCorner && destOpt.label === "diagonal";
    if (!takeDiagonal) {
      for (let s = 1; s <= steps; s++) {
        const newIdx = piece.idx + s;
        if (newIdx >= 20) { coords.push(CORNERS[0]); break; }
        coords.push(outerCoord(newIdx));
      }
    } else {
      const toCorner = DIAGONAL_PARTNER[piece.idx];
      const path = diagonalPath(piece.idx);
      for (let s = 1; s <= steps; s++) {
        if (s >= 6) {
          if (toCorner === 0) { coords.push(CORNERS[0]); return coords; }
          coords.push(CORNERS[15]);
          pushOuterFrom15(coords, steps - s);
          return coords;
        }
        coords.push(path[s].coord);
      }
    }
    return coords;
  }
  if (DIAG_INFO[piece.mode]) {
    const { from: fromCorner, to: toCorner } = DIAG_INFO[piece.mode];
    const path = diagonalPath(fromCorner);
    for (let s = 1; s <= steps; s++) {
      const newIdx = piece.idx + s;
      if (newIdx >= 6) {
        if (toCorner === 0) { coords.push(CORNERS[0]); return coords; }
        coords.push(CORNERS[15]);
        pushOuterFrom15(coords, steps - s);
        return coords;
      }
      coords.push(path[newIdx].coord);
    }
    return coords;
  }
  if (piece.mode === "center") {
    const toCorner = destOpt.label === "home" ? 0 : 15;
    const path = centerExitPath(toCorner);
    for (let s = 1; s <= steps; s++) {
      if (s >= 3) {
        if (toCorner === 0) { coords.push(CORNERS[0]); return coords; }
        coords.push(CORNERS[15]);
        pushOuterFrom15(coords, steps - s);
        return coords;
      }
      coords.push(path[s].coord);
    }
    return coords;
  }
  if (piece.mode === "centerHome" || piece.mode === "center15") {
    const toCorner = piece.mode === "centerHome" ? 0 : 15;
    const path = centerExitPath(toCorner);
    for (let s = 1; s <= steps; s++) {
      const newIdx = piece.idx + s;
      if (newIdx >= 3) {
        if (toCorner === 0) { coords.push(CORNERS[0]); return coords; }
        coords.push(CORNERS[15]);
        pushOuterFrom15(coords, steps - s);
        return coords;
      }
      coords.push(path[newIdx].coord);
    }
    return coords;
  }
  return coords;
}
