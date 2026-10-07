import type { Metadata } from "next";
import Link from "next/link";
import { deleteRecipe } from "@/actions/admin-recipes";
import { AdminHeader } from "@/components/admin/admin-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { NoticeToast } from "@/components/admin/notice-toast";
import { DifficultyBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FoodImage } from "@/components/ui/food-image";
import { PencilIcon, PlusIcon } from "@/components/ui/icons";
import { requireAdmin } from "@/lib/auth/session";
import { getRecipes } from "@/lib/data/recipes";
import { formatMinutes } from "@/lib/format";

export const metadata: Metadata = { title: "Recipes" };

const notices = { created: "Recipe added.", updated: "Changes saved." };

export default async function AdminRecipesPage() {
  await requireAdmin();
  const recipes = await getRecipes();

  return (
    <>
      <NoticeToast messages={notices} />
      <AdminHeader
        title="Recipes"
        description="Easy recipes shown on the public Recipes page."
        action={
          <ButtonLink href="/admin/recipes/new">
            <PlusIcon width={18} height={18} /> Add recipe
          </ButtonLink>
        }
      />

      {recipes.length === 0 ? (
        <EmptyState
          emoji="📖"
          title="No recipes yet"
          action={<ButtonLink href="/admin/recipes/new">Add recipe</ButtonLink>}
        />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line/60">
          {recipes.map((r) => (
            <li key={r.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
              <div className="group h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <FoodImage src={r.image} alt="" className="h-full w-full text-2xl transition-transform duration-300 ease-out group-hover:scale-125" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/recipes/${r.id}`} className="font-medium hover:underline" target="_blank">
                  {r.name}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>{formatMinutes(r.cookingTime)}</span>
                  <span aria-hidden="true">·</span>
                  <span>Serves {r.servings}</span>
                  <DifficultyBadge difficulty={r.difficulty} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/recipes/${r.id}/edit`}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-stone-100 hover:text-ink"
                  aria-label={`Edit ${r.name}`}
                  title="Edit"
                >
                  <PencilIcon width={18} height={18} />
                </Link>
                <DeleteButton action={deleteRecipe.bind(null, r.id)} itemName={r.name} title="Delete recipe?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
