import "server-only";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

/** Known categories first (in menu order), then any custom ones alphabetically. */
function categoryRank(category: string) {
  const i = DEFAULT_CATEGORIES.indexOf(category);
  return i === -1 ? DEFAULT_CATEGORIES.length : i;
}

function byCategory<T extends { category: string; name: string }>(items: T[]) {
  return items.sort(
    (a, b) =>
      categoryRank(a.category) - categoryRank(b.category) ||
      a.category.localeCompare(b.category) ||
      a.name.localeCompare(b.name),
  );
}

/** Menu shown to customers: available items only. */
export async function getAvailableFoodItems() {
  await connection();
  const items = await db.foodItem.findMany({
    where: { available: true },
    select: {
      id: true,
      name: true,
      description: true,
      priceCents: true,
      image: true,
      category: true,
    },
  });
  return byCategory(items);
}
export type MenuItem = Awaited<ReturnType<typeof getAvailableFoodItems>>[number];

export async function getAllFoodItems() {
  await connection();
  return byCategory(await db.foodItem.findMany());
}

export async function getFoodItem(id: string) {
  await connection();
  return db.foodItem.findUnique({ where: { id } });
}

export async function getFoodCategories() {
  await connection();
  const rows = await db.foodItem.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category);
}
