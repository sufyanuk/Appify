import type { Metadata } from "next";
import { RecipeList } from "@/components/recipes/recipe-list";
import { PageHeader } from "@/components/site/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getRecipes } from "@/lib/data/recipes";

export const metadata: Metadata = { title: "Easy Kokni recipes" };

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        eyebrow="Recipes"
        title="Easy Kokni recipes"
        description="Simple Konkan home cooking with everyday ingredients."
      />

      {recipes.length === 0 ? (
        <div className="mt-10">
          <EmptyState emoji="📖" title="No recipes yet" text="Check back soon for new ideas." />
        </div>
      ) : (
        <RecipeList recipes={recipes} />
      )}
    </div>
  );
}
