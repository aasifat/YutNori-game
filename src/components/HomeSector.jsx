export function HomeSector({ game }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 0,
      }}
    >
      <h3
        style={{
          fontFamily: "'Baloo 2', sans-serif",
          color: "#ffb84d",
          fontSize: "0.82rem",
          margin: "0 0 8px",
          textAlign: "center",
          lineHeight: 1.2,
          flexShrink: 0,
        }}
      >
        Home
        <br />
        Sector
      </h3>
      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          maxHeight: "100%",
          width: 74,
          border: "2px solid #ffb84d",
          borderRadius: 9999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "rgba(0,0,0,0.18)",
        }}
      >
        {game.players.map((pl, pIdx) => {
          const homeCount = pl.pieces.filter((p) => p.mode === "home").length;
          return (
            <div
              key={pIdx}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "8px 0",
                borderBottom: pIdx === 0 ? "2px solid #ffb84d" : "none",
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: i < homeCount ? pl.colorVar : "transparent",
                    border: `2px solid ${i < homeCount ? pl.colorVar : "#465b78"}`,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
