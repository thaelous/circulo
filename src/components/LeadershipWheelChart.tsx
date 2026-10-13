import React, { useState } from "react";
import { WheelDimension } from "../types/leadership";
import { Sparkles, AlertTriangle } from "lucide-react";

interface LeadershipWheelChartProps {
  dimensiones: WheelDimension[];
  size?: number;
}

export const LeadershipWheelChart: React.FC<LeadershipWheelChartProps> = ({
  dimensiones,
  size = 460,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!dimensiones || dimensiones.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400 text-xs italic">
        No se han cargado dimensiones de la rueda.
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.35; // room for labels
  const numAxes = dimensiones.length;

  // Actual score points (solid fill)
  const polygonPoints = dimensiones.map((dim, i) => {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const score10 = dim.puntuacion > 10 ? dim.puntuacion / 10 : dim.puntuacion;
    const r = (maxR / 10) * Math.min(Math.max(score10, 0), 10);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    return { x, y, angle, r, dim, index: i };
  });

  const polygonPathD =
    polygonPoints.reduce(
      (acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
      ""
    ) + " Z";

  // Target projection points (dashed line)
  const targetPoints = dimensiones.map((dim, i) => {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const targetVal = dim.metaProyeccion ?? dim.puntuacion;
    const score10 = targetVal > 10 ? targetVal / 10 : targetVal;
    const r = (maxR / 10) * Math.min(Math.max(score10, 0), 10);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    return { x, y, val: targetVal };
  });

  const targetPathD =
    targetPoints.reduce(
      (acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
      ""
    ) + " Z";

  return (
    <div className="flex flex-col items-center select-none relative">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Concentric rings (1 to 10) */}
        {[2, 4, 6, 8, 10].map((ring) => {
          const r = (maxR / 10) * ring;
          return (
            <g key={ring}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={ring === 10 ? "rgba(248, 250, 252, 0.6)" : "transparent"}
                stroke={ring === 10 ? "#64748B" : "#CBD5E1"}
                strokeWidth={ring === 10 ? 1.5 : 0.8}
                strokeDasharray={ring === 10 ? "none" : ring % 4 === 0 ? "none" : "2 3"}
              />
              <text
                x={cx + 3}
                y={cy - r + 9}
                fill="#94A3B8"
                fontSize="9"
                fontWeight="600"
              >
                {ring}
              </text>
            </g>
          );
        })}

        {/* Radial axes lines */}
        {dimensiones.map((_, i) => {
          const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
          const x = cx + Math.cos(angle) * maxR;
          const y = cy + Math.sin(angle) * maxR;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="#CBD5E1"
              strokeWidth={1.2}
            />
          );
        })}

        {/* Projected Target Polygon (dashed green line) */}
        <path
          d={targetPathD}
          fill="none"
          stroke="#059669"
          strokeWidth={2}
          strokeDasharray="5 4"
        />

        {/* Shaded Area Polygon (Actual scores) */}
        <path
          d={polygonPathD}
          fill="rgba(14, 165, 233, 0.25)"
          stroke="#0284C7"
          strokeWidth={2.5}
          className="transition-all duration-300"
        />

        {/* Data points & interactive handles */}
        {polygonPoints.map((pt, i) => {
          const isPalanca = pt.dim.esPalanca;
          const isImpacto = pt.dim.esImpacto;
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Outer halo */}
              {(isPalanca || isImpacto || isHovered) && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 12 : 9}
                  fill={
                    isPalanca
                      ? "rgba(245, 158, 11, 0.25)"
                      : isImpacto
                      ? "rgba(239, 68, 68, 0.25)"
                      : "rgba(14, 165, 233, 0.25)"
                  }
                  className="animate-pulse"
                />
              )}

              {/* Point dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : 4.5}
                fill={isPalanca ? "#F59E0B" : isImpacto ? "#EF4444" : "#0284C7"}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            </g>
          );
        })}

        {/* Axis Labels Around Rim */}
        {dimensiones.map((dim, i) => {
          const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
          const labelDist = maxR + 32;
          const lx = cx + Math.cos(angle) * labelDist;
          const ly = cy + Math.sin(angle) * labelDist;
          const isPalanca = dim.esPalanca;
          const isImpacto = dim.esImpacto;
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={`label-${i}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isHovered ? "11" : "10"}
                fontWeight={isPalanca || isImpacto || isHovered ? "700" : "500"}
                fill={
                  isPalanca
                    ? "#B45309"
                    : isImpacto
                    ? "#B91C1C"
                    : isHovered
                    ? "#0284C7"
                    : "#334155"
                }
              >
                {dim.nombre}
              </text>
              <text
                x={lx}
                y={ly + 12}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill={isPalanca ? "#D97706" : isImpacto ? "#DC2626" : "#64748B"}
              >
                {dim.puntuacion}/10
                {dim.metaProyeccion ? ` → ${dim.metaProyeccion}` : ""}
                {isPalanca ? " [P.P.]" : isImpacto ? " [P.I.]" : ""}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend & Hover Info */}
      <div className="w-full mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-600 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
            Actual
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-600 inline-block" />
            Meta Proyectada
          </span>
          <span className="flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-500" />
            P.P. (Palanca)
          </span>
          <span className="flex items-center gap-1 text-rose-700 font-semibold text-[11px]">
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            P.I. (Impacto)
          </span>
        </div>

        {hoveredIdx !== null && (
          <div className="bg-slate-900 text-white px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 shadow-md">
            <span className="font-bold">{dimensiones[hoveredIdx].nombre}:</span>
            <span className="text-sky-300 font-mono font-bold">
              {dimensiones[hoveredIdx].puntuacion}/10
            </span>
            {dimensiones[hoveredIdx].metaProyeccion && (
              <span className="text-emerald-300 font-mono text-[10px]">
                (Meta: {dimensiones[hoveredIdx].metaProyeccion}/10)
              </span>
            )}
            {dimensiones[hoveredIdx].esPalanca && (
              <span className="bg-amber-400 text-slate-900 text-[9px] px-1 font-bold rounded">
                P.P. PALANCA
              </span>
            )}
            {dimensiones[hoveredIdx].esImpacto && (
              <span className="bg-rose-500 text-white text-[9px] px-1 font-bold rounded">
                P.I. IMPACTO
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
