import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { RankedRow } from "@/lib/data/orders";

/*
 * Dashboard building blocks in plain HTML/CSS/SVG — no chart library.
 * Magnitudes use one hue (the kokum brand colour); every mark has a visible
 * value or an accessible label. Interactive line charts live in line-chart.tsx.
 */

export function ChartCard({
  title,
  subtitle,
  headline,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  headline?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl bg-white p-5 shadow-card ring-1 ring-line/60", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
        {headline}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ChartEmpty({ text = "No orders in this period yet." }: { text?: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-line text-sm text-muted">
      {text}
    </div>
  );
}

/** Tiny trend line for a KPI tile (decorative; the tile states the numbers). */
function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  const w = 72;
  const h = 24;
  const pts = values.map((v, i) => `${((i / Math.max(1, values.length - 1)) * w).toFixed(1)},${(h - 2 - (v / max) * (h - 4)).toFixed(1)}`);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="overflow-visible">
      <polyline points={pts.join(" ")} fill="none" stroke="#b0285f" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts.at(-1)?.split(",")[0]} cy={pts.at(-1)?.split(",")[1]} r={3} fill="#b0285f" />
    </svg>
  );
}

/** KPI tile: month-to-date value, change vs the same days last month, sparkline. */
export function KpiTile({
  label,
  value,
  current,
  previous,
  trend,
  href,
}: {
  label: string;
  value: string;
  current: number;
  previous: number;
  trend: number[];
  href?: string;
}) {
  const change = previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;
  const up = change !== null && change >= 0;
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted sm:text-sm">{label}</p>
        <Sparkline values={trend} />
      </div>
      <p className="mt-1 whitespace-nowrap text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-2 text-xs text-muted">
        {change === null ? (
          <span>{current > 0 ? "New this month" : "No data last month"}</span>
        ) : change === 0 ? (
          <>
            <span className="font-semibold text-ink">— 0%</span> vs same days last month
          </>
        ) : (
          <>
            <span className={cn("font-semibold", up ? "text-emerald-700" : "text-red-700")}>
              {up ? "▲" : "▼"} {Math.abs(change)}%
            </span>{" "}
            vs same days last month
          </>
        )}
      </p>
    </>
  );
  const className = "block rounded-2xl bg-white p-4 shadow-card ring-1 ring-line/60 transition hover:ring-ink/20 sm:p-5";
  return href ? (
    <a href={href} className={className}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}

/** Horizontal bars for ranked magnitudes (top dishes, sales by category). */
export function RankedBars({
  rows,
  formatValue,
  formatSecondary,
  emptyText,
}: {
  rows: RankedRow[];
  formatValue: (v: number) => string;
  formatSecondary?: (v: number) => string;
  emptyText?: string;
}) {
  if (rows.length === 0) return <ChartEmpty text={emptyText} />;
  const max = Math.max(...rows.map((r) => r.value));

  return (
    <ul className="space-y-3.5">
      {rows.map((r) => (
        <li key={r.label} tabIndex={0} className="group outline-none" aria-label={`${r.label}: ${formatValue(r.value)}${formatSecondary ? `, ${formatSecondary(r.secondary)}` : ""}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate">{r.label}</span>
            <span className="shrink-0 font-semibold tabular-nums">
              {formatValue(r.value)}
              {formatSecondary && (
                <span className="ml-1.5 text-xs font-normal text-muted">{formatSecondary(r.secondary)}</span>
              )}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-brand-500 transition-colors group-hover:bg-brand-700 group-focus:bg-brand-700"
              style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
