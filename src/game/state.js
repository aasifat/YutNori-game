export function freshPlayer(name, colorVar) {
  return {
    name,
    colorVar,
    pieces: [0, 1, 2, 3].map((id) => ({ id, mode: "start", idx: 0 })),
  };
}
export function freshGame() {
  return {
    current: 0,
    players: [freshPlayer("Blue", "#3fb6ff"), freshPlayer("Red", "#ff5d73")],
    pendingRolls: [],
    canThrow: true,
    winner: null,
  };
}
