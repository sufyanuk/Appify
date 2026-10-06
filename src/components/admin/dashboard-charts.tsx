import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";
import type { DailyPoint, RankedRow } from "@/lib/data/orders";
import { formatPrice } from "@/lib/format";

/*
 * Lightweight dashboard charts in plain HTML/CSS — no chart library.
 * Single-series charts use one hue (the kokum brand colour); status uses the
 * same colours as the status badges and is always labelled, never colour-only.
 * Every mark has a hover/focus tooltip and an accessible label.
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

const dayLabel = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

/** Column chart: revenue per day, with order count in the tooltip. */
export function RevenueByDayChart({ data }: { data: DailyPoint[] }) {
  const max = Math.max(...data.map((d) => d.revenueCents));
  if (max === 0) return <ChartEmpty />;

  return (
    <div>
      <div className="relative h-44">
        {/* recessive gridlines: max and half */}
        {[1, 0.5].map((f) => (
          <div key={f} className="absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${f * 100}%` }}>
            <span className="absolute -top-2.5 left-0 bg-white pr-1 text-[10px] text-muted tabular-nums">
              {formatPrice(Math.round((max * f) / 100) * 100)}
            </span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-end gap-1 pl-14 sm:gap-1.5">
          {data.map((d) => {
            const label = `${dayLabel(d.day, { weekday: "short", day: "numeric", month: "short" })}: ${formatPrice(d.revenueCents)} from ${d.orders} order${d.orders === 1 ? "" : "s"}`;
            return (
              <div
                key={d.day}
                tabIndex={0}
                aria-label={label}
                className="group relative flex h-full flex-1 items-end outline-none"
              >
                <div
                  className={cn(
                    "w-full rounded-t-[4px] transition-colors",
                    d.revenueCents > 0 ? "bg-brand-500 group-hover:bg-brand-700 group-focus:bg-brand-700" : "bg-stone-200",
                  )}
                  style={{ height: d.revenueCents > 0 ? `${Math.max(3, (d.revenueCents / max) * 100)}%` : "2px" }}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-max -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-xs text-white shadow-float group-hover:block group-focus:block">
                  <p className="font-medium">{dayLabel(d.day, { weekday: "short", day: "numeric", month: "short" })}</p>
                  <p className="tabular-nums">
                    {formatPrice(d.revenueCents)} · {d.orders} order{d.orders === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex gap-1 pl-14 text-[10px] text-muted sm:gap-1.5">
        {data.map((d, i) => (
          <span key={d.day} className="flex-1 whitespace-nowrap text-center">
            {i === 0 || i === 7 || i === data.length - 1 ? dayLabel(d.day, { day: "numeric", month: "short" }) : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  RECEIVED: "bg-sky-500",
  PREPARING: "bg-amber-400",
  READY: "bg-brand-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

/** Part-to-whole: one stacked bar of orders by status, with a labelled legend. */
export function OrdersByStatusChart({ counts }: { counts: Partial<Record<string, number>> }) {
  const rows = ORDER_STATUSES.map((s) => ({ status: s, count: counts[s] ?? 0 }));
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  if (total === 0) return <ChartEmpty text="No orders yet." />;

  return (
    <div>
      <div className="flex h-4 w-full gap-[2px] overflow-hidden rounded-full" role="img" aria-label={rows.map((r) => `${ORDER_STATUS_LABELS[r.status]} ${r.count}`).join(", ")}>
        {rows
          .filter((r) => r.count > 0)
          .map((r) => (
            <div
              key={r.status}
              className={cn("group relative h-full", STATUS_COLOR[r.status])}
              style={{ width: `${(r.count / total) * 100}%` }}
              title={`${ORDER_STATUS_LABELS[r.status]}: ${r.count}`}
            />
          ))}
      </div>
      <ul className="mt-5 space-y-2.5">
        {rows.map((r) => (
          <li key={r.status} className="flex items-center gap-3 text-sm">
            <span className={cn("h-3 w-3 shrink-0 rounded-sm", STATUS_COLOR[r.status])} aria-hidden="true" />
            <span className="flex-1">{ORDER_STATUS_LABELS[r.status]}</span>
            <span className="font-semibold tabular-nums">{r.count}</span>
            <span className="w-10 text-right text-xs text-muted tabular-nums">
              {Math.round((r.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
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
