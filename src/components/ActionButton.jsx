export function ActionButton({ emoji, label, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className={`action-btn${primary ? " action-btn--primary" : ""}`}
    >
      <span aria-hidden="true">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
