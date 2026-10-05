import type { Metadata } from "next";
import { createFoodItem } from "@/actions/admin-food";
import { AdminHeader } from "@/components/admin/admin-header";
import { BackLink } from "@/components/admin/back-link";
import { FoodForm } from "@/components/admin/food-form";
import { requireAdmin } from "@/lib/auth/session";
import { DEFAULT_CATEGORIES } from "@/lib/constants";
import { getFoodCategories } from "@/lib/data/food";

export const metadata: Metadata = { title: "Add food item" };

export default async function NewFoodPage() {
  await requireAdmin();
  const categories = [...new Set([...(await getFoodCategories()), ...DEFAULT_CATEGORIES])];

  return (
    <>
      <BackLink href="/admin/food">Food items</BackLink>
      <AdminHeader title="Add food item" description="New items appear on the order page straight away." />
      <FoodForm action={createFoodItem} categories={categories} />
    </>
  );
}
