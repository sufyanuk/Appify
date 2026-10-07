import type { Metadata } from "next";
import { createRecipe } from "@/actions/admin-recipes";
import { AdminHeader } from "@/components/admin/admin-header";
import { BackLink } from "@/components/admin/back-link";
import { RecipeForm } from "@/components/admin/recipe-form";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Add recipe" };

export default async function NewRecipePage() {
  await requireAdmin();
  return (
    <>
      <BackLink href="/admin/recipes">Recipes</BackLink>
      <AdminHeader title="Add recipe" />
      <RecipeForm action={createRecipe} />
    </>
  );
}
