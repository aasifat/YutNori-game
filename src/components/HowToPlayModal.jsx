const cellStyle = { padding: "5px 6px", borderBottom: "1px solid #24405f", textAlign: "left" };

export function HowToPlayModal({ onClose }) {
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
      <div style={{ background: "#152740", border: "2px solid #ffb84d", borderRadius: 22, padding: 22, maxWidth: 520, maxHeight: "85vh", overflowY: "auto" }}>
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif", color: "#ffb84d", marginBottom: 10 }}>How to Play</h2>
        <p>
          <strong>Goal:</strong> Get all 4 of your pieces around the board and home before your opponent.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", margin: "10px 0", fontSize: "0.85rem" }}>
          <tbody>
            <tr>
              <th style={cellStyle}>Throw</th>
              <th style={cellStyle}>Spaces</th>
              <th style={cellStyle}>Bonus</th>
            </tr>
            {[
              ["Do (도)", "1", "—"],
              ["Gae (개)", "2", "—"],
              ["Geol (걸)", "3", "—"],
              ["Yut (윷)", "4", "Throw again"],
              ["Mo (모)", "5", "Throw again"],
            ].map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td key={i} style={cellStyle}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <ul style={{ paddingLeft: 18, fontSize: "0.88rem", lineHeight: 1.6 }}>
          <li>
            <strong>Catch:</strong> Land exactly on an opponent's piece to send it back to start — and earn a free
            extra throw.
          </li>
          <li>
            <strong>Stack:</strong> Land on your own piece to merge into a stack. Stacks move together as one unit.
          </li>
          <li>
            <strong>Diagonals:</strong> Landing on the top-right or top-left corner lets you cut diagonally through
            the center — you'll be shown both path options. A piece resting exactly on the center can then continue
            toward home or downward to the bottom-left corner.
          </li>
          <li>
            <strong>Preview:</strong> Hover any glowing piece to see its full path and landing tile before you commit
            to the move.
          </li>
          <li>
            <strong>Turns:</strong> Rolling Yut or Mo, or catching a piece, earns you another throw before your turn
            ends.
          </li>
        </ul>
        <button
          onClick={onClose}
          style={{
            marginTop: 14,
            width: "100%",
            padding: 10,
            border: "none",
            borderRadius: 10,
            background: "#ffb84d",
            color: "#3a2400",
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "'Baloo 2', sans-serif",
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
