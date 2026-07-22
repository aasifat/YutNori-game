export function TeamPiecesRow({ game, armedRollId, onSelectGroup, onPieceEnter, onPieceLeave, animation }) {
  return (
    <div style={{ display: "flex", flexWrap: "nowrap", gap: 10 }}>
      {game.players.map((pl, pIdx) => {
        const animatingIds =
          animation && animation.fromPool && animation.pIdx === pIdx ? animation.groupIds : [];
        const startPieces = pl.pieces.filter((p) => p.mode === "start" && !animatingIds.includes(p.id));
        const canSelect = pIdx === game.current && armedRollId !== null && !animation;
        return (
          <div
            key={pIdx}
            style={{
              flex: "1 1 50%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                margin: "0 0 4px",
                color: pl.colorVar,
                letterSpacing: "0.02em",
              }}
            >
              Team {pIdx + 1} ({pl.name})
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: startPieces.length ? "space-evenly" : "center",
                gap: 8,
                width: "100%",
                maxWidth: 260,
                minHeight: 34,
                padding: "5px 16px",
                borderRadius: 9999,
                border: `2px solid ${pl.colorVar}`,
                background: "rgba(0,0,0,0.18)",
              }}
            >
              {startPieces.map((p) => (
                <div
                  key={p.id}
                  onClick={() => canSelect && onSelectGroup(pIdx, [p.id])}
                  onMouseEnter={() => canSelect && onPieceEnter(pIdx, [p.id])}
                  onMouseLeave={() => canSelect && onPieceLeave()}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    flexShrink: 0,
                    border: "2.5px solid #0f1b2b",
                    cursor: canSelect ? "pointer" : "default",
                    background: pl.colorVar,
                    filter: canSelect ? "drop-shadow(0 0 6px rgba(255,255,255,0.9))" : "none",
                  }}
                />
              ))}
              {startPieces.length === 0 && (
                <span style={{ fontSize: "0.68rem", opacity: 0.5 }}>All on board</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
