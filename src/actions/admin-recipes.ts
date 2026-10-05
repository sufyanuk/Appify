"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { toLines } from "@/lib/format";
import {
  fieldErrorsOf,
  formValues,
  recipeSchema,
  type ActionResult,
  type FormState,
} from "@/lib/validation";

function parseRecipeForm(formData: FormData) {
  const parsed = recipeSchema.safeParse({
    name: formData.get("name") ?? "",
    description: formData.get("description") ?? "",
    image: formData.get("image") ?? "",
    ingredients: formData.get("ingredients") ?? "",
    instructions: formData.get("instructions") ?? "",
    cookingTime: formData.get("cookingTime") ?? "",
    servings: formData.get("servings") ?? "",
    difficulty: formData.get("difficulty") ?? "",
  });
  if (!parsed.success) return parsed;
  // Normalise the line based fields (drop blank lines / stray whitespace).
  parsed.data.ingredients = toLines(parsed.data.ingredients).join("\n");
  parsed.data.instructions = toLines(parsed.data.instructions).join("\n");
  return parsed;
}

function refreshRecipes(id?: string) {
  revalidatePath("/recipes");
  if (id) revalidatePath(`/recipes/${id}`);
  revalidatePath("/admin", "layout");
}

export async function createRecipe(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseRecipeForm(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values: formValues(formData) };
  }
  try {
    await db.recipe.create({ data: parsed.data });
  } catch (error) {
    console.error("createRecipe failed", error);
    return { message: "Could not save the recipe. Please try again.", values: formValues(formData) };
  }
  refreshRecipes();
  redirect("/admin/recipes?notice=created");
}

export async function updateRecipe(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseRecipeForm(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values: formValues(formData) };
  }
  try {
    await db.recipe.update({ where: { id }, data: parsed.data });
  } catch (error) {
    console.error("updateRecipe failed", error);
    return {
      message: "Could not save changes. The recipe may have been deleted.",
      values: formValues(formData),
    };
  }
  refreshRecipes(id);
  redirect("/admin/recipes?notice=updated");
}

export async function deleteRecipe(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.recipe.delete({ where: { id } });
  } catch (error) {
    console.error("deleteRecipe failed", error);
    return { ok: false, message: "Could not delete the recipe. It may already be gone." };
  }
  refreshRecipes(id);
  return { ok: true, message: "Recipe deleted." };
}
