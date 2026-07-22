import { CORNERS } from "../game/board.js";
import { CORNER_IMAGES } from "../constants/cornerImages.js";

export function CornerImage({ corner, size }) {
  const src = CORNER_IMAGES[corner];
  const [x, y] = CORNERS[corner];
  const half = size / 2;
  return (
    <foreignObject x={x - half} y={y - half} width={size} height={size}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          border: "3px solid #ffb84d",
          background: "#0f1e33",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {src ? (
          <img src={src} alt={`Corner ${corner}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: size * 0.35, opacity: 0.5 }}>🖼️</span>
        )}
      </div>
    </foreignObject>
  );
}
