import { Dice5 } from "lucide-react";
import "./styles/yutnori.css";

import { useYutnoriGame } from "./hooks/useYutnoriGame.js";
import { ActionButton } from "./components/ActionButton.jsx";
import { ThrowResultPopup } from "./components/ThrowResultPopup.jsx";
import { BoardSVG } from "./components/BoardSVG.jsx";
import { TeamPiecesRow } from "./components/TeamPiecesRow.jsx";
import { HomeSector } from "./components/HomeSector.jsx";
import { Instruction } from "./components/Instruction.jsx";
import { HowToPlayModal } from "./components/HowToPlayModal.jsx";
import { WinModal } from "./components/WinModal.jsx";
import { shade } from "./utils/color.js";
import { useState } from "react";

export default function YutnoriGame() {
  const {
    game,
    armedRollId,
    selection,
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
  } = useYutnoriGame();
  const [howToOpen, setHowToOpen] = useState(false);

  const curPlayer = game.players[game.current];
  const turnColor = curPlayer.colorVar;

  return (
    <div
      style={{
        height: "100svh",
        width: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 15% 10%, #1c3358 0%, transparent 45%), radial-gradient(circle at 85% 90%, #24406a 0%, transparent 45%), #0f1b2b",
        color: "#fff6e6",
        fontFamily: "'Nunito', sans-serif",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1000,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "10px 14px 12px",
          boxSizing: "border-box",
          minHeight: 0,
        }}
      >
        {/* Header */}
        <header
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            paddingBottom: 10,
            marginBottom: 8,
            borderBottom: "2px solid rgba(255,184,77,0.22)",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                color: "#ffb84d",
                fontSize: "1.55rem",
                fontWeight: 800,
                margin: 0,
                letterSpacing: "0.01em",
              }}
            >
              YutNori
            </h1>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "#a9c3e0",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Traditional Korean Board Game
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <ActionButton emoji="📖" label="How to Play" onClick={() => setHowToOpen(true)} />
            <ActionButton emoji="🔄" label="Rematch" onClick={resetGame} primary />
          </div>
        </header>

        {/* Main content: team pieces row (auto) / court (fills remaining space) / controls (auto) */}
        <div
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            display: "grid",
            gridTemplateRows: "auto minmax(0, 1fr) auto auto",
            gap: 8,
          }}
        >
          <TeamPiecesRow
            game={game}
            armedRollId={armedRollId}
            onSelectGroup={onSelectGroup}
            onPieceEnter={onPieceEnter}
            onPieceLeave={onPieceLeave}
            animation={animation}
          />

          {/* Court row: board in column 1, Home sector in column 2.
              Using CSS Grid (not flexbox) here on purpose — a grid with two
              fixed columns has no concept of "wrapping", so the Home Sector
              physically cannot drop below the court on any screen size. */}
          <div
            style={{
              minHeight: 0,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 92px",
              gap: 12,
            }}
          >
            <div
              style={{
                minWidth: 0,
                minHeight: 0,
                background: "#152740",
                border: "2px solid #24405f",
                borderRadius: 20,
                padding: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  maxWidth: "100%",
                  aspectRatio: "500 / 526",
                }}
              >
                <BoardSVG
                  game={game}
                  armedRollId={armedRollId}
                  selection={selection}
                  destOptions={destOptions}
                  hoverRoutes={hoverRoutes}
                  groupsForPlayer={groupsForPlayer}
                  onSelectGroup={onSelectGroup}
                  onExecuteMove={chooseDestination}
                  onPieceEnter={onPieceEnter}
                  onPieceLeave={onPieceLeave}
                  animation={animation}
                />
                <ThrowResultPopup popup={popup} />
              </div>
            </div>

            <div style={{ minWidth: 0, minHeight: 0, display: "flex" }}>
              <HomeSector game={game} />
            </div>
          </div>

          {/* Turn indicator + Throw Yut button — one centered row below the court */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "11px 22px",
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.02em",
                textAlign: "center",
                borderRadius: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 0 rgba(0,0,0,0.25)",
                background: `linear-gradient(135deg, ${turnColor}, ${shade(turnColor, -25)})`,
                color: "#08131f",
              }}
            >
              {game.winner ? `${game.players[game.winner - 1].name} Wins! 🏆` : `${curPlayer.name}'s Turn`}
            </div>

            <button
              onClick={doThrow}
              disabled={!game.canThrow || !!game.winner || !!animation}
              style={{
                padding: "11px 20px",
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: `2px solid ${game.canThrow && !game.winner && !animation ? "#ffb84d" : "#3a5068"}`,
                borderRadius: 9999,
                cursor: game.canThrow && !game.winner && !animation ? "pointer" : "not-allowed",
                color: game.canThrow && !game.winner && !animation ? "#ffd98f" : "#5c728f",
                background: game.canThrow && !game.winner && !animation ? "#20140c" : "#16222f",
                boxShadow: game.canThrow && !game.winner && !animation ? "0 4px 0 #6b3d16" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                whiteSpace: "nowrap",
              }}
            >
              <Dice5 size={18} />
              {game.pendingRolls.length && game.canThrow ? "Throw Again" : "Throw Yut"}
            </button>
          </div>

          {/* Pending-throw chips (only when a choice is needed) + instruction line */}
          <div
            style={{
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            {game.pendingRolls.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {game.pendingRolls.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => armRoll(r.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 20,
                      background: armedRollId === r.id ? "#5be08a" : "#0f1e33",
                      color: armedRollId === r.id ? "#06331b" : "#fff6e6",
                      border: `2px solid ${armedRollId === r.id ? "#2a7a4c" : "#395a86"}`,
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      fontFamily: "'Baloo 2', sans-serif",
                    }}
                  >
                    {r.name} · {r.steps}
                  </button>
                ))}
              </div>
            )}

            <Instruction game={game} armedRollId={armedRollId} selection={selection} destOptions={destOptions} animation={animation} />
          </div>
        </div>
      </div>

      {howToOpen && <HowToPlayModal onClose={() => setHowToOpen(false)} />}
      {game.winner && <WinModal name={game.players[game.winner - 1].name} onRematch={resetGame} />}
    </div>
  );
}
