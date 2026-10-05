import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateRecipe } from "@/actions/admin-recipes";
import { AdminHeader } from "@/components/admin/admin-header";
import { BackLink } from "@/components/admin/back-link";
import { RecipeForm } from "@/components/admin/recipe-form";
import { requireAdmin } from "@/lib/auth/session";
import { getRecipe } from "@/lib/data/recipes";

export const metadata: Metadata = { title: "Edit recipe" };

export default async function EditRecipePage({ params }: PageProps<"/admin/recipes/[id]/edit">) {
  await requireAdmin();
  const recipe = await getRecipe((await params).id);
  if (!recipe) notFound();

  return (
    <>
      <BackLink href="/admin/recipes">Recipes</BackLink>
      <AdminHeader title={`Edit ${recipe.name}`} />
      <RecipeForm action={updateRecipe.bind(null, recipe.id)} recipe={recipe} />
    </>
  );
}
