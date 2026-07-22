/* =========================================================
   BOARD GEOMETRY
   29 positions total: 20 outer ring nodes (corners at 0,5,10,15)
   + 9 interior nodes (3 shortcut arms of 2 nodes each, converging
   on 1 shared center, then 2 shared nodes down to the home corner).
   ========================================================= */
export const CORNERS = { 0: [450, 450], 5: [450, 50], 10: [50, 50], 15: [50, 450] };
export const CENTER = [250, 250];

export function outerCoord(i) {
  i = ((i % 20) + 20) % 20;
  if (i % 5 === 0) return CORNERS[i];
  const side = Math.floor(i / 5);
  const startCorner = [0, 5, 10, 15][side];
  const endCorner = [0, 5, 10, 15][(side + 1) % 4];
  const start = CORNERS[startCorner];
  const end = CORNERS[endCorner];
  const t = (i % 5) / 5;
  return [start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t];
}
export function armPoint(corner, step) {
  const [cx, cy] = CORNERS[corner];
  return [cx + (CENTER[0] - cx) * (step / 3), cy + (CENTER[1] - cy) * (step / 3)];
}
// Point `step` hops out from the CENTER toward `corner` (mirror of armPoint,
// which measures from the corner inward) — used for paths that leave center.
export function centerArmPoint(corner, step) {
  return armPoint(corner, 3 - step);
}
// The board's two real diagonals cross at the center: top-left(10)<->home(0),
// and top-right(5)<->bottom-left(15). A piece diagonalling from a top corner
// always continues on to its diagonal partner, never toward home from both.
export const DIAGONAL_PARTNER = { 5: 15, 10: 0 };
export const DIAG_INFO = {
  diag5: { from: 5, to: DIAGONAL_PARTNER[5] },
  diag10: { from: 10, to: DIAGONAL_PARTNER[10] },
};
export function diagonalPath(fromCorner) {
  const toCorner = DIAGONAL_PARTNER[fromCorner];
  return [
    { coord: CORNERS[fromCorner] },
    { coord: armPoint(fromCorner, 1) },
    { coord: armPoint(fromCorner, 2) },
    { coord: CENTER, center: true },
    { coord: centerArmPoint(toCorner, 1) },
    { coord: centerArmPoint(toCorner, 2) },
    toCorner === 0 ? { home: true } : { coord: CORNERS[toCorner] },
  ];
}
// The two routes available when a piece rests exactly on the center node.
export function centerExitPath(toCorner) {
  return [
    { coord: CENTER, center: true },
    { coord: centerArmPoint(toCorner, 1) },
    { coord: centerArmPoint(toCorner, 2) },
    toCorner === 0 ? { home: true } : { coord: CORNERS[toCorner] },
  ];
}
export function coordFor(piece) {
  if (piece.mode === "outer") return outerCoord(piece.idx);
  if (DIAG_INFO[piece.mode]) return diagonalPath(DIAG_INFO[piece.mode].from)[piece.idx].coord;
  if (piece.mode === "center") return CENTER;
  if (piece.mode === "centerHome") return centerExitPath(0)[piece.idx].coord;
  if (piece.mode === "center15") return centerExitPath(15)[piece.idx].coord;
  return null;
}

/* Precompute static geometry once (doesn't depend on state) */
export const OUTER_NODES = Array.from({ length: 20 }, (_, i) => ({ i, coord: outerCoord(i), corner: i % 5 === 0 }));
export const ARM_NODES = [5, 10, 15].flatMap((c) => [1, 2].map((step) => armPoint(c, step)));
export const HOME_ARM_NODES = [1, 2].map((step) => centerArmPoint(0, step));
