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
/** Calendar day in Qatar time, e.g. "2026-10-06". */
const qatarDay = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Qatar" }).format(d);

export type DailyPoint = { day: string; revenueCents: number; orders: number };
export type RankedRow = { label: string; value: number; secondary: number };

export async function getDashboardStats() {
  await connection();
  const now = new Date();
  const since14 = new Date(now.getTime() - 14 * DAY_MS);
  const since30 = new Date(now.getTime() - 30 * DAY_MS);
  const notCancelled = { status: { not: "CANCELLED" } };

  const [
    totalOrders,
    pendingOrders,
    availableItems,
    totalItems,
    recipes,
    revenue,
    recentOrders,
    recent14,
    statusGroups,
    topItemGroups,
    categoryLines,
  ] = await Promise.all([
    db.order.count(),
    db.order.count({ where: { status: { in: PENDING_STATUSES } } }),
    db.foodItem.count({ where: { available: true } }),
    db.foodItem.count(),
    db.recipe.count(),
    db.order.aggregate({ _sum: { totalCents: true }, where: notCancelled }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: withItems }),
    db.order.findMany({
      where: { ...notCancelled, createdAt: { gte: since14 } },
      select: { createdAt: true, totalCents: true },
    }),
    db.order.groupBy({ by: ["status"], _count: { _all: true } }),
    db.orderItem.groupBy({
      by: ["name"],
      where: { order: { ...notCancelled, createdAt: { gte: since30 } } },
      _sum: { quantity: true, lineTotalCents: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 6,
    }),
    db.orderItem.findMany({
      where: { order: { ...notCancelled, createdAt: { gte: since30 } } },
      select: { lineTotalCents: true, quantity: true, foodItem: { select: { category: true } } },
      take: 5000,
    }),
  ]);

  // Revenue per day for the last 14 days (Qatar time), including empty days.
  const byDay = new Map<string, DailyPoint>();
  for (let i = 13; i >= 0; i--) {
    const day = qatarDay(new Date(now.getTime() - i * DAY_MS));
    byDay.set(day, { day, revenueCents: 0, orders: 0 });
  }
  for (const o of recent14) {
    const point = byDay.get(qatarDay(o.createdAt));
    if (point) {
      point.revenueCents += o.totalCents;
      point.orders += 1;
    }
  }

  const statusCounts = Object.fromEntries(statusGroups.map((g) => [g.status, g._count._all]));

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
    totalOrders,
    pendingOrders,
    availableItems,
    totalItems,
    recipes,
    revenueCents: revenue._sum.totalCents ?? 0,
    recentOrders,
    daily: [...byDay.values()],
    statusCounts: statusCounts as Partial<Record<string, number>>,
    topItems,
    categorySales: [...byCategory.values()].sort((a, b) => b.value - a.value),
  };
}
