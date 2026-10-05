import "server-only";
import { connection } from "next/server";
import { db } from "@/lib/db";

export async function getRecipes() {
  await connection();
  return db.recipe.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getRecipe(id: string) {
  await connection();
  return db.recipe.findUnique({ where: { id } });
}
