"use client";

import type React from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

/*
 * Small, dependency-free interactive line chart.
 * - One y-axis, recessive gridlines, 2px lines, 8px markers with a surface ring.
 * - Hover/touch shows a crosshair and a tooltip with every series' value.
 * - Focus the chart and use ← / → to move between points (keyboard access).
 * - A single series gets a soft area fill; multiple series get a legend and
 *   direct end labels so identity is never colour-only.
 */

export type LineSeries = { key: string; name: string; color: string; values: number[] };

type Props = {
  labels: string[]; // x labels, e.g. "Oct"
  tooltipLabels?: string[]; // fuller labels, e.g. "Oct 2026"
  series: LineSeries[];
  formatValue: (v: number) => string;
  formatAxis?: (v: number) => string;
  height?: number;
  ariaLabel: string;
  /** The last point is an incomplete period (e.g. month to date): drawn dashed. */
  partialLast?: boolean;
  /** Extra controls shown on the right of the legend row. */
  toolbar?: React.ReactNode;
};

const PAD = { top: 16, right: 16, bottom: 28, left: 56 };

/** Round the axis to 4 "nice" steps (1, 2, 2.5, 5 × 10ⁿ) so labels read cleanly. */
function niceMax(v: number) {
  if (v <= 0) return 4;
  const rough = v / 4;
  const mag = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= rough) ?? 10 * mag;
  return step * 4;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

export function LineChart({
  labels,
  tooltipLabels = labels,
  series,
  formatValue,
  formatAxis = formatValue,
  height = 260,
  ariaLabel,
  partialLast = false,
  toolbar,
}: Props) {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();
  const n = labels.length;

  const geometry = useMemo(() => {
    const innerW = Math.max(0, width - PAD.left - PAD.right);
    const innerH = height - PAD.top - PAD.bottom;
    const max = niceMax(Math.max(0, ...series.flatMap((s) => s.values)));
    const x = (i: number) => PAD.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
    const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
    return { innerW, innerH, max, x, y, ticks };
  }, [width, height, series, n]);

  const { x, y, ticks, innerH } = geometry;
  const single = series.length === 1;
  const showEvery = width < 420 ? Math.ceil(n / 4) : width < 640 ? 2 : 1;

  function indexFromClientX(clientX: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || n === 0) return null;
    const rel = clientX - rect.left - PAD.left;
    const step = n <= 1 ? 1 : geometry.innerW / (n - 1);
    return Math.max(0, Math.min(n - 1, Math.round(rel / step)));
  }

  const tooltipLeft = active === null ? 0 : Math.min(Math.max(x(active), 90), Math.max(width - 90, 90));

  return (
    <div className="w-full">
      {(!single || toolbar) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          {!single ? (
            <ul className="flex flex-wrap gap-4 text-xs text-muted">
              {series.map((s) => (
                <li key={s.key} className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                  {s.name}
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          {toolbar}
        </div>
      )}
      <div
        ref={wrapRef}
        className="relative w-full touch-pan-y select-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        style={{ height }}
        tabIndex={0}
        role="img"
        aria-label={ariaLabel}
        onMouseMove={(e) => setActive(indexFromClientX(e.clientX))}
        onMouseLeave={() => setActive(null)}
        onTouchStart={(e) => setActive(indexFromClientX(e.touches[0].clientX))}
        onTouchMove={(e) => setActive(indexFromClientX(e.touches[0].clientX))}
        onFocus={() => setActive((a) => a ?? n - 1)}
        onBlur={() => setActive(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setActive((a) => Math.max(0, (a ?? n) - 1));
          if (e.key === "ArrowRight") setActive((a) => Math.min(n - 1, (a ?? -1) + 1));
        }}
      >
        {width > 0 && (
          <svg width={width} height={height} className="block overflow-visible" aria-hidden="true">
            {single && (
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={series[0].color} stopOpacity="0.18" />
                  <stop offset="100%" stopColor={series[0].color} stopOpacity="0" />
                </linearGradient>
              </defs>
            )}

            {/* gridlines + y labels */}
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="#ece8e3" strokeDasharray={t === 0 ? undefined : "3 4"} />
                <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted text-[10px] tabular-nums">
                  {formatAxis(t)}
                </text>
              </g>
            ))}

            {/* x labels */}
            {labels.map((l, i) =>
              i % showEvery === 0 || i === n - 1 ? (
                <text key={l + i} x={x(i)} y={height - 8} textAnchor="middle" className="fill-muted text-[10px]">
                  {l}
                </text>
              ) : null,
            )}

            {/* crosshair */}
            {active !== null && (
              <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + innerH} stroke="#a8a29e" strokeDasharray="3 3" />
            )}

            {series.map((s, si) => {
              const solidCount = partialLast && n > 1 ? n - 1 : n;
              const pathFor = (from: number, to: number) =>
                s.values
                  .slice(from, to)
                  .map((v, j) => `${j === 0 ? "M" : "L"}${x(from + j).toFixed(1)},${y(v).toFixed(1)}`)
                  .join(" ");
              const d = pathFor(0, solidCount);
              const full = pathFor(0, n);
              const area = `${full} L${x(n - 1).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;
              const last = s.values[n - 1];
              // Direct end labels only where they don't collide with an earlier series' label.
              const labelY = y(last) - 10;
              const collides = series.slice(0, si).some((o) => Math.abs(y(o.values[n - 1]) - 10 - labelY) < 14);
              return (
                <g key={s.key}>
                  {single && <path d={area} fill={`url(#${gradientId})`} />}
                  <path d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                  {solidCount < n && (
                    <path d={pathFor(n - 2, n)} fill="none" stroke={s.color} strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" />
                  )}
                  {/* end marker + direct label (multi-series) */}
                  <circle cx={x(n - 1)} cy={y(last)} r={4} fill={s.color} stroke="#fff" strokeWidth={2} />
                  {!single && width >= 420 && !collides && (
                    <text x={x(n - 1) - 8} y={y(last) - 10} textAnchor="end" className="fill-ink text-[10px] font-medium">
                      {s.name}
                    </text>
                  )}
                  {active !== null && (
                    <circle cx={x(active)} cy={y(s.values[active])} r={5} fill={s.color} stroke="#fff" strokeWidth={2} />
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {active !== null && width > 0 && (
          <div
            className="pointer-events-none absolute top-0 z-10 w-max -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-float"
            style={{ left: tooltipLeft }}
          >
            <p className="mb-1 font-medium">
              {tooltipLabels[active]}
              {partialLast && active === n - 1 && <span className="font-normal text-white/70"> · month to date</span>}
            </p>
            {series.map((s) => {
              const v = s.values[active];
              const before = active > 0 ? s.values[active - 1] : null;
              // No % change for an incomplete period — it would always look like a drop.
              const partial = partialLast && active === n - 1;
              const change = before && !partial ? Math.round(((v - before) / before) * 100) : null;
              return (
                <p key={s.key} className="flex items-center gap-2 tabular-nums">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                  {!single && <span className="text-white/70">{s.name}</span>}
                  <span className="font-semibold">{formatValue(v)}</span>
                  {change !== null && (
                    <span className={change >= 0 ? "text-emerald-300" : "text-red-300"}>
                      {change >= 0 ? "▲" : "▼"} {Math.abs(change)}%
                    </span>
                  )}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
