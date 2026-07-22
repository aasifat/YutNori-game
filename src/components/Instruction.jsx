export function Instruction({ game, armedRollId, selection, destOptions, animation }) {
  let msg;
  if (animation) msg = "Piece moving…";
  else if (game.winner) msg = "Game over — start a rematch anytime.";
  else if (game.canThrow && !game.pendingRolls.length)
    msg = `${game.players[game.current].name}: throw the yut sticks to begin your turn.`;
  else if (armedRollId == null && game.pendingRolls.length > 1)
    msg = "You have multiple throws pending — tap one below, then tap a piece to move it.";
  else if (armedRollId != null && !selection) msg = "Hover a highlighted piece to preview its move, then tap to confirm.";
  else if (destOptions.length) {
    if (destOptions.length > 1) {
      const isCenterChoice = destOptions.some((o) => o.label === "home" || o.label === "down");
      msg = isCenterChoice
        ? "Choose a path: shortcut home or continue diagonally toward the bottom-left."
        : "Choose a path: outer ring or the golden diagonal shortcut.";
    } else msg = "Tap the glowing space to confirm the move.";
  }
  else msg = "Select a throw result to move a piece.";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
        fontSize: "0.82rem",
        background: "#152740",
        border: "2px solid #24405f",
        borderLeft: "4px solid #ffb84d",
        padding: "7px 12px",
        borderRadius: 10,
        textAlign: "center",
      }}
    >
      {msg}
    </div>
  );
}
