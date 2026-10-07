import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DifficultyBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { FoodImage } from "@/components/ui/food-image";
import { ArrowLeftIcon, ClockIcon, UsersIcon } from "@/components/ui/icons";
import { getRecipe } from "@/lib/data/recipes";
import { formatMinutes, toLines } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/recipes/[id]">): Promise<Metadata> {
  const recipe = await getRecipe((await params).id);
  return { title: recipe?.name ?? "Recipe not found", description: recipe?.description };
}

export default async function RecipePage({ params }: PageProps<"/recipes/[id]">) {
  const recipe = await getRecipe((await params).id);
  if (!recipe) notFound();

  const ingredients = toLines(recipe.ingredients);
  const steps = toLines(recipe.instructions);

  return (
    <article className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1.5 rounded-full py-2 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeftIcon width={16} height={16} /> All recipes
      </Link>

      <div className="mt-3 overflow-hidden rounded-3xl">
        <FoodImage src={recipe.image} alt={recipe.name} eager className="aspect-[16/9] w-full" />
      </div>

      <header className="mt-6 sm:mt-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{recipe.name}</h1>
        {recipe.description && <p className="mt-3 text-lg text-muted">{recipe.description}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-line">
            <ClockIcon width={16} height={16} /> {formatMinutes(recipe.cookingTime)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-line">
            <UsersIcon width={16} height={16} /> Serves {recipe.servings}
          </span>
          <DifficultyBadge difficulty={recipe.difficulty} />
        </div>
      </header>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.6fr]">
        <section>
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <ul className="mt-4 space-y-2.5">
            {ingredients.map((item, i) => (
              <li key={i} className="flex gap-3 text-[15px]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Method</h2>
          <ol className="mt-4 space-y-5">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 text-[15px] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-14 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-8 text-center">
        <p className="font-medium">Not in the mood to cook?</p>
        <ButtonLink href="/order">Order homemade food instead</ButtonLink>
      </div>
    </article>
  );
}
