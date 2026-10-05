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

export async function getDashboardStats() {
  await connection();
  const [totalOrders, pendingOrders, availableItems, totalItems, recipes, revenue, recentOrders] =
    await Promise.all([
      db.order.count(),
      db.order.count({ where: { status: { in: PENDING_STATUSES } } }),
      db.foodItem.count({ where: { available: true } }),
      db.foodItem.count(),
      db.recipe.count(),
      db.order.aggregate({
        _sum: { totalCents: true },
        where: { status: { not: "CANCELLED" } },
      }),
      db.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: withItems }),
    ]);

  return {
    totalOrders,
    pendingOrders,
    availableItems,
    totalItems,
    recipes,
    revenueCents: revenue._sum.totalCents ?? 0,
    recentOrders,
  };
}
