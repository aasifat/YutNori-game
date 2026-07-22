import { Trophy } from "lucide-react";

export function WinModal({ name, onRematch }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6,12,22,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 50,
      }}
    >
      <div style={{ background: "#152740", border: "2px solid #ffb84d", borderRadius: 22, padding: 22, maxWidth: 420, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Trophy size={48} color="#ffb84d" />
        </div>
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: "1.8rem", margin: 0 }}>{name} Wins!</h2>
        <p>All 4 pieces made it home.</p>
        <button
          onClick={onRematch}
          style={{
            marginTop: 14,
            width: "100%",
            padding: 12,
            border: "none",
            borderRadius: 10,
            background: "#5be08a",
            color: "#06331b",
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "'Baloo 2', sans-serif",
            fontSize: "1rem",
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
