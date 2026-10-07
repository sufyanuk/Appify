import Link from "next/link";
import type { Recipe } from "@prisma/client";
import { DifficultyBadge } from "@/components/ui/badge";
import { FoodImage } from "@/components/ui/food-image";
import { ClockIcon } from "@/components/ui/icons";
import { formatMinutes } from "@/lib/format";

export function RecipeCard({ recipe, priority = false }: { recipe: Recipe; priority?: boolean }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-line/60 transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <FoodImage
          src={recipe.image}
          alt={recipe.name}
          eager={priority}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-semibold">{recipe.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{recipe.description}</p>
        <div className="mt-auto flex items-center gap-3 pt-4 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon width={16} height={16} />
            {formatMinutes(recipe.cookingTime)}
          </span>
          <DifficultyBadge difficulty={recipe.difficulty} />
        </div>
      </div>
    </Link>
  );
}
