export const THROW_TABLE = [
  { flats: 1, name: "Do", steps: 1, bonus: false },
  { flats: 2, name: "Gae", steps: 2, bonus: false },
  { flats: 3, name: "Geol", steps: 3, bonus: false },
  { flats: 4, name: "Yut", steps: 4, bonus: true },
  { flats: 0, name: "Mo", steps: 5, bonus: true },
];
export function simulateThrow() {
  let flats = 0;
  for (let i = 0; i < 4; i++) if (Math.random() < 0.5) flats++;
  return THROW_TABLE.find((r) => r.flats === flats);
}
