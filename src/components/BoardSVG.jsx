import { CORNERS, CENTER, armPoint, coordFor, OUTER_NODES, ARM_NODES, HOME_ARM_NODES } from "../game/board.js";
import { ROUTE_COLOR } from "../constants/routeColors.js";
import { shade } from "../utils/color.js";
import { CornerImage } from "./CornerImage.jsx";

export function BoardSVG({
  game,
  armedRollId,
  selection,
  destOptions,
  hoverRoutes,
  groupsForPlayer,
  onSelectGroup,
  onExecuteMove,
  onPieceEnter,
  onPieceLeave,
  animation,
}) {
  return (
    <svg
      viewBox="0 0 500 526"
      style={{ width: "100%", height: "100%", display: "block", touchAction: "manipulation" }}
    >
      {/* outer ring lines */}
      {OUTER_NODES.map((n, i) => {
        const next = OUTER_NODES[(i + 1) % 20];
        return (
          <line
            key={`ol${i}`}
            x1={n.coord[0]}
            y1={n.coord[1]}
            x2={next.coord[0]}
            y2={next.coord[1]}
            stroke="#2a4a72"
            strokeWidth={6}
            strokeLinecap="round"
          />
        );
      })}
      {/* diagonals */}
      {[5, 10, 15, 0].map((c) => {
        const pts = [CORNERS[c], armPoint(c, 1), armPoint(c, 2), CENTER];
        return pts.slice(0, -1).map((pt, i) => (
          <line
            key={`d${c}-${i}`}
            x1={pt[0]}
            y1={pt[1]}
            x2={pts[i + 1][0]}
            y2={pts[i + 1][1]}
            stroke="#2a4a72"
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.75}
          />
        ));
      })}
      {/* outer nodes */}
      {OUTER_NODES.map((n) => (
        <circle
          key={`n${n.i}`}
          cx={n.coord[0]}
          cy={n.coord[1]}
          r={n.corner ? 15 : 9}
          fill={n.corner ? "#f2c14e" : "#1c3252"}
          stroke={n.corner ? "#8a6413" : "#3a5d8c"}
          strokeWidth={2}
        />
      ))}
      {/* interior nodes */}
      {ARM_NODES.map((pt, i) => (
        <circle key={`arm${i}`} cx={pt[0]} cy={pt[1]} r={8} fill="#1c3252" stroke="#3a5d8c" strokeWidth={2} />
      ))}
      {HOME_ARM_NODES.map((pt, i) => (
        <circle key={`home-arm${i}`} cx={pt[0]} cy={pt[1]} r={8} fill="#1c3252" stroke="#3a5d8c" strokeWidth={2} />
      ))}
      <circle cx={CENTER[0]} cy={CENTER[1]} r={8} fill="#1c3252" stroke="#3a5d8c" strokeWidth={2} />

      {/* corner images */}
      {[0, 5, 10, 15].map((c) => (
        <CornerImage key={`img${c}`} corner={c} size={84} />
      ))}

      <text
        x={CORNERS[0][0] + 45}
        y={CORNERS[0][1] + 66}
        textAnchor="end"
        fill="#fff8e0"
        stroke="#241505"
        strokeWidth={5}
        paintOrder="stroke fill"
        style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 19, fontWeight: 800, letterSpacing: "0.04em" }}
      >
        START / HOME
      </text>

      {/* hover landing-preview: intermediate tiles (small dots) + destination
          (pulsing ring), one route per possible destination, colored by
          route type (green = outer ring, gold = shortcut) */}
      {hoverRoutes &&
        !selection &&
        hoverRoutes.map((route, ri) => {
          const color = ROUTE_COLOR[route.opt.label] || ROUTE_COLOR.outer;
          const pts = route.waypoints;
          if (!pts.length) return null;
          const dest = pts[pts.length - 1];
          return (
            <g key={`hover${ri}`} pointerEvents="none">
              {pts.length > 1 && (
                <polyline
                  points={pts.map((p) => p.join(",")).join(" ")}
                  fill="none"
                  stroke={color}
                  strokeWidth={3}
                  strokeDasharray="7 7"
                  opacity={0.55}
                />
              )}
              {pts.slice(0, -1).map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={7} fill={color} opacity={0.4} />
              ))}
              <circle
                cx={dest[0]}
                cy={dest[1]}
                r={17}
                fill={`${color}33`}
                stroke={color}
                strokeWidth={4}
                style={{ animation: "previewPulse 1.1s ease-in-out infinite" }}
              />
            </g>
          );
        })}

      {/* destination highlights — pointerEvents:"all" so the whole disc
          is clickable, not just the thin stroke ring (fill is "none") */}
      {selection &&
        !animation &&
        destOptions.map((opt, i) => {
          const coord = opt.mode === "home" ? CORNERS[0] : coordFor(opt);
          return (
            <circle
              key={`dest${i}`}
              cx={coord[0]}
              cy={coord[1]}
              r={18}
              fill="rgba(0,0,0,0.001)"
              stroke={ROUTE_COLOR[opt.label] || "#5be08a"}
              strokeWidth={4}
              style={{ cursor: "pointer", animation: "pulse 1s infinite", pointerEvents: "all" }}
              onClick={() => onExecuteMove(opt)}
            />
          );
        })}

      {/* pieces already on the board */}
      {[0, 1].map((pIdx) =>
        groupsForPlayer(pIdx).map((group, gi) => {
          // While this exact group is mid-hop, skip its normal render —
          // the animating ghost token below stands in for it instead.
          if (
            animation &&
            animation.pIdx === pIdx &&
            animation.groupIds.length === group.length &&
            group.every((p) => animation.groupIds.includes(p.id))
          ) {
            return null;
          }
          const [x, y] = coordFor(group[0]);
          const color = game.players[pIdx].colorVar;
          const isCurrent = pIdx === game.current;
          const canSelect = isCurrent && armedRollId !== null && !animation;
          const groupIds = group.map((p) => p.id);
          return (
            <g
              key={`grp${pIdx}-${gi}`}
              style={{
                cursor: canSelect ? "pointer" : "default",
                filter: canSelect ? "drop-shadow(0 0 6px rgba(255,255,255,0.85))" : "none",
              }}
              onClick={() => canSelect && onSelectGroup(pIdx, groupIds)}
              onMouseEnter={() => canSelect && onPieceEnter(pIdx, groupIds)}
              onMouseLeave={() => canSelect && onPieceLeave()}
            >
              <circle cx={x} cy={y} r={14} fill={color} stroke={shade(color, -40)} strokeWidth={2.5} />
              {group.length > 1 && (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 12, fontWeight: 800, fill: "#0f1b2b" }}
                >
                  {group.length}
                </text>
              )}
            </g>
          );
        })
      )}

      {/* animating "ghost" token — hops tile by tile through the path */}
      {animation && animation.stepIndex > 0 && (() => {
        const wp = animation.waypoints[Math.min(animation.stepIndex, animation.waypoints.length) - 1];
        if (!wp) return null;
        const color = game.players[animation.pIdx].colorVar;
        const count = animation.groupIds.length;
        return (
          <g
            key={`hop-${animation.stepIndex}`}
            style={{ animation: "hop 0.26s ease", transformBox: "fill-box", transformOrigin: "center" }}
          >
            <circle cx={wp[0]} cy={wp[1]} r={14} fill={color} stroke={shade(color, -40)} strokeWidth={2.5} />
            {count > 1 && (
              <text
                x={wp[0]}
                y={wp[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 12, fontWeight: 800, fill: "#0f1b2b" }}
              >
                {count}
              </text>
            )}
          </g>
        );
      })()}
    </svg>
  );
}
