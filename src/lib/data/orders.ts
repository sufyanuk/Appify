import "server-only";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { PENDING_STATUSES, type OrderStatus } from "@/lib/constants";

const withItems = {
  items: {
    select: { id: true, name: true, quantity: true, unitPriceCents: true, lineTotalCents: true },
  },
} as const;

/** Public lookup for the confirmation page — by unguessable publicId only. */
export async function getOrderByPublicId(publicId: string) {
  await connection();
  return db.order.findUnique({ where: { publicId }, include: withItems });
}

/** filter: a single status, "pending" (still being worked on), or undefined for all. */
export async function getOrders(filter?: OrderStatus | "pending") {
  await connection();
  return db.order.findMany({
    where:
      filter === "pending"
        ? { status: { in: PENDING_STATUSES } }
        : filter
          ? { status: filter }
          : undefined,
    orderBy: { createdAt: "desc" },
    include: withItems,
    take: 200,
  });
}
export type OrderWithItems = Awaited<ReturnType<typeof getOrders>>[number];

const DAY_MS = 24 * 60 * 60 * 1000;
/** Calendar date in Qatar time, e.g. "2026-10-06". */
const qatarDate = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Qatar" }).format(d);

export type MonthPoint = {
  month: string; // "2026-10"
  label: string; // "Oct 2026"
  short: string; // "Oct"
  revenueCents: number;
  orders: number;
  customers: number;
  newCustomers: number;
  returningCustomers: number;
  avgOrderCents: number;
};
export type Kpi = { current: number; previous: number };
export type RankedRow = { label: string; value: number; secondary: number };

/** A stable key for "the same customer": phone digits, else name. */
function customerKey(o: { id: number; customerPhone: string; customerName: string }) {
  const digits = o.customerPhone.replace(/\D/g, "");
  if (digits.length >= 7) return `p:${digits.slice(-8)}`;
  const name = o.customerName.trim().toLowerCase();
  return name ? `n:${name}` : `o:${o.id}`;
}

function monthLabel(month: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" }).format(new Date(`${month}-01T00:00:00Z`));
}

export async function getDashboardStats() {
  await connection();
  const now = new Date();
  const since90 = new Date(now.getTime() - 90 * DAY_MS);
  const notCancelled = { status: { not: "CANCELLED" } };

  const [pendingOrders, availableItems, totalItems, recentOrders, allOrders, topItemGroups, categoryLines] =
    await Promise.all([
      db.order.count({ where: { status: { in: PENDING_STATUSES } } }),
      db.foodItem.count({ where: { available: true } }),
      db.foodItem.count(),
      db.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: withItems }),
      db.order.findMany({
        where: notCancelled,
        select: { id: true, createdAt: true, totalCents: true, customerPhone: true, customerName: true },
        orderBy: { createdAt: "asc" },
        take: 50000,
      }),
      db.orderItem.groupBy({
        by: ["name"],
        where: { order: { ...notCancelled, createdAt: { gte: since90 } } },
        _sum: { quantity: true, lineTotalCents: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 6,
      }),
      db.orderItem.findMany({
        where: { order: { ...notCancelled, createdAt: { gte: since90 } } },
        select: { lineTotalCents: true, quantity: true, foodItem: { select: { category: true } } },
        take: 20000,
      }),
    ]);

  // --- Last 12 months (Qatar time), oldest first, including empty months.
  const today = qatarDate(now);
  const [ty, tm] = today.split("-").map(Number);
  const months: MonthPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(ty, tm - 1 - i, 1));
    const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    months.push({
      month,
      label: monthLabel(month, { month: "short", year: "numeric" }),
      short: monthLabel(month, { month: "short" }),
      revenueCents: 0,
      orders: 0,
      customers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      avgOrderCents: 0,
    });
  }
  const byMonth = new Map(months.map((m) => [m.month, m]));
  const firstMonthOf = new Map<string, string>(); // customer -> first order month (all time)
  const seenInMonth = new Map<string, Set<string>>();

  // Month-to-date vs the same days of last month.
  const thisMonth = months[11].month;
  const lastMonth = months[10].month;
  const dayOfMonth = Number(today.slice(8, 10));
  const mtd = { revenue: 0, orders: 0, customers: new Set<string>() };
  const prev = { revenue: 0, orders: 0, customers: new Set<string>() };

  for (const o of allOrders) {
    const date = qatarDate(o.createdAt);
    const month = date.slice(0, 7);
    const key = customerKey(o);
    if (!firstMonthOf.has(key)) firstMonthOf.set(key, month);

    const point = byMonth.get(month);
    if (point) {
      point.revenueCents += o.totalCents;
      point.orders += 1;
      const seen = seenInMonth.get(month) ?? new Set<string>();
      if (!seen.has(key)) {
        seen.add(key);
        point.customers += 1;
        if (firstMonthOf.get(key) === month) point.newCustomers += 1;
        else point.returningCustomers += 1;
      }
      seenInMonth.set(month, seen);
    }

    const day = Number(date.slice(8, 10));
    if (day <= dayOfMonth) {
      const bucket = month === thisMonth ? mtd : month === lastMonth ? prev : null;
      if (bucket) {
        bucket.revenue += o.totalCents;
        bucket.orders += 1;
        bucket.customers.add(key);
      }
    }
  }
  for (const m of months) m.avgOrderCents = m.orders ? Math.round(m.revenueCents / m.orders) : 0;

  const kpis = {
    revenue: { current: mtd.revenue, previous: prev.revenue } satisfies Kpi,
    orders: { current: mtd.orders, previous: prev.orders } satisfies Kpi,
    customers: { current: mtd.customers.size, previous: prev.customers.size } satisfies Kpi,
    avgOrder: {
      current: mtd.orders ? Math.round(mtd.revenue / mtd.orders) : 0,
      previous: prev.orders ? Math.round(prev.revenue / prev.orders) : 0,
    } satisfies Kpi,
  };

  const topItems: RankedRow[] = topItemGroups.map((g) => ({
    label: g.name,
    value: g._sum.quantity ?? 0,
    secondary: g._sum.lineTotalCents ?? 0,
  }));

  const byCategory = new Map<string, RankedRow>();
  for (const line of categoryLines) {
    const label = line.foodItem?.category ?? "Removed items";
    const row = byCategory.get(label) ?? { label, value: 0, secondary: 0 };
    row.value += line.lineTotalCents;
    row.secondary += line.quantity;
    byCategory.set(label, row);
  }

  return {
    pendingOrders,
    availableItems,
    totalItems,
    totalCustomers: firstMonthOf.size,
    recentOrders,
    months,
    kpis,
    dayOfMonth,
    topItems,
    categorySales: [...byCategory.values()].sort((a, b) => b.value - a.value),
  };
}
