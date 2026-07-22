export function ThrowResultPopup({ popup }) {
  if (!popup) return null;
  const color = popup.bonus ? "#ffd23f" : "#5be08a";
  return (
    <div
      key={popup.key}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      <div
        className="throw-popup"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "16px 5%",
          minWidth: "40%",
          borderRadius: 24,
          background: "linear-gradient(160deg, rgba(21,39,64,0.96), rgba(9,17,30,0.96))",
          border: `3px solid ${color}`,
          boxShadow: `0 18px 40px rgba(0,0,0,0.55), 0 0 40px ${popup.bonus ? "rgba(255,210,63,0.35)" : "rgba(91,224,138,0.3)"}`,
        }}
      >
        <span
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
            fontWeight: 800,
            letterSpacing: "0.03em",
            color,
            textTransform: "uppercase",
            textShadow: "0 3px 0 rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {popup.name} · {popup.steps}
        </span>
        {popup.bonus && (
          <span style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.03em", color: "#ffe9b0" }}>
            BONUS — THROW AGAIN!
          </span>
        )}
      </div>
    </div>
  );
}
