"use client";

import { useState } from "react";
import type { Recipe } from "@prisma/client";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { matchesSearch } from "@/lib/search";
import { RecipeCard } from "./recipe-card";

/** Recipe grid with a search box (name, description, ingredients). */
export function RecipeList({ recipes }: { recipes: Recipe[] }) {
  const [query, setQuery] = useState("");
  const visible = recipes.filter((r) =>
    matchesSearch(query, [r.name, r.description, r.ingredients, r.difficulty]),
  );

  return (
    <>
      <SearchInput
        value={query}
        onChange={setQuery}
        label="Search recipes"
        placeholder="Search recipes or ingredients — e.g. kokum, vada pav"
        className="mt-8 max-w-xl"
      />
      {query.trim() && (
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {visible.length === 0
            ? "No recipes found"
            : `${visible.length} recipe${visible.length === 1 ? "" : "s"} found`}
        </p>
      )}
      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            emoji="🔍"
            title={`No recipes match “${query.trim()}”`}
            text="Try another dish name or ingredient."
            action={
              <button
                type="button"
                onClick={() => setQuery("")}
                className="h-11 rounded-full bg-ink px-5 text-sm font-medium text-white hover:bg-stone-700"
              >
                Show all recipes
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} priority={i < 3} />
          ))}
        </div>
      )}
    </>
  );
}
