"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { MonthPoint } from "@/lib/data/orders";
import { formatPrice } from "@/lib/format";
import { LineChart } from "./line-chart";

const KOKUM = "#b0285f"; // brand-500
const BLUE = "#2a78d6"; // second series (validated pair with kokum)

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });
const money = (cents: number) => formatPrice(cents);
const moneyAxis = (cents: number) => `QAR ${compact.format(cents / 100)}`;
const count = (v: number) => String(Math.round(v));

const METRICS = [
  { key: "revenue", label: "Revenue", get: (m: MonthPoint) => m.revenueCents, format: money, axis: moneyAxis },
  { key: "orders", label: "Orders", get: (m: MonthPoint) => m.orders, format: count, axis: count },
  { key: "customers", label: "Customers", get: (m: MonthPoint) => m.customers, format: count, axis: count },
  { key: "aov", label: "Avg order", get: (m: MonthPoint) => m.avgOrderCents, format: money, axis: moneyAxis },
] as const;

const RANGES = [
  { months: 6, label: "6M" },
  { months: 12, label: "12M" },
] as const;

function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full bg-stone-100 p-0.5 text-xs font-medium">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-8 rounded-full px-3 transition-colors",
            o.value === value ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Main trend: one metric at a time (one axis), switchable, 6 or 12 months. */
export function MonthlyTrend({ months }: { months: MonthPoint[] }) {
  const [metricKey, setMetricKey] = useState<(typeof METRICS)[number]["key"]>("revenue");
  const [range, setRange] = useState<number>(12);
  const metric = METRICS.find((m) => m.key === metricKey)!;
  const data = months.slice(-range);
  const values = data.map(metric.get);
  const total = metricKey === "aov"
    ? (() => {
        const orders = data.reduce((s, m) => s + m.orders, 0);
        return orders ? Math.round(data.reduce((s, m) => s + m.revenueCents, 0) / orders) : 0;
      })()
    : metricKey === "customers"
      ? null
      : values.reduce((s, v) => s + v, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Metric"
          value={metricKey}
          onChange={setMetricKey}
          options={METRICS.map((m) => ({ value: m.key, label: m.label }))}
        />
        <div className="flex items-center gap-3">
          {total !== null && (
            <p className="text-right text-xs text-muted">
              {metricKey === "aov" ? "Average" : "Total"} · last {range} months
              <span className="block text-base font-semibold text-ink tabular-nums">{metric.format(total)}</span>
            </p>
          )}
          <Segmented
            label="Range"
            value={range}
            onChange={setRange}
            options={RANGES.map((r) => ({ value: r.months, label: r.label }))}
          />
        </div>
      </div>
      <div className="mt-4">
        <LineChart
          ariaLabel={`${metric.label} per month, last ${range} months`}
          labels={data.map((m) => m.short)}
          tooltipLabels={data.map((m) => m.label)}
          series={[{ key: metric.key, name: metric.label, color: KOKUM, values }]}
          formatValue={metric.format}
          formatAxis={metric.axis}
          partialLast
        />
      </div>
    </div>
  );
}

/** Customers per month: new vs returning (two lines on one count axis). */
export function CustomersTrend({ months }: { months: MonthPoint[] }) {
  const [range, setRange] = useState<number>(12);
  const data = months.slice(-range);
  return (
    <div>
      <LineChart
        partialLast
        toolbar={
          <Segmented
            label="Range"
            value={range}
            onChange={setRange}
            options={RANGES.map((r) => ({ value: r.months, label: r.label }))}
          />
        }
        ariaLabel={`New and returning customers per month, last ${range} months`}
        height={240}
        labels={data.map((m) => m.short)}
        tooltipLabels={data.map((m) => m.label)}
        series={[
          { key: "new", name: "New", color: KOKUM, values: data.map((m) => m.newCustomers) },
          { key: "returning", name: "Returning", color: BLUE, values: data.map((m) => m.returningCustomers) },
        ]}
        formatValue={count}
        formatAxis={count}
      />
    </div>
  );
}
