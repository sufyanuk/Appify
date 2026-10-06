import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateFoodItem } from "@/actions/admin-food";
import { AdminHeader } from "@/components/admin/admin-header";
import { BackLink } from "@/components/admin/back-link";
import { FoodForm } from "@/components/admin/food-form";
import { requireAdmin } from "@/lib/auth/session";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import { getFoodCategories, getFoodItem } from "@/lib/data/food";

export const metadata: Metadata = { title: "Edit food item" };

export default async function EditFoodPage({ params }: PageProps<"/admin/food/[id]/edit">) {
  await requireAdmin();
  const { id } = await params;
  const [item, existing] = await Promise.all([getFoodItem(id), getFoodCategories()]);
  if (!item) notFound();
  const categories = [...new Set([...DEFAULT_CATEGORIES, ...existing])];

  return (
    <>
      <BackLink href="/admin/food">Food items</BackLink>
      <AdminHeader title={`Edit ${item.name}`} />
      <FoodForm action={updateFoodItem.bind(null, item.id)} item={item} categories={categories} />
    </>
  );
}
