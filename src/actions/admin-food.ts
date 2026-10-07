"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import {
  fieldErrorsOf,
  foodItemSchema,
  formValues,
  type ActionResult,
  type FormState,
} from "@/lib/validation";


function parseFoodForm(formData: FormData) {
  return foodItemSchema.safeParse({
    name: formData.get("name") ?? "",
    description: formData.get("description") ?? "",
    price: formData.get("price") ?? "",
    image: formData.get("image") ?? "",
    category: formData.get("category") ?? "",
    available: formData.get("available") ?? "",
  });
}

function refreshMenu() {
  revalidatePath("/order");
  revalidatePath("/admin", "layout");
}

export async function createFoodItem(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseFoodForm(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values: formValues(formData) };
  }
  const { price, ...rest } = parsed.data;

  try {
    await db.foodItem.create({ data: { ...rest, priceCents: price } });
  } catch (error) {
    console.error("createFoodItem failed", error);
    return { message: "Could not save the item. Please try again.", values: formValues(formData) };
  }
  refreshMenu();
  redirect("/admin/food?notice=created");
}

export async function updateFoodItem(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseFoodForm(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values: formValues(formData) };
  }
  const { price, ...rest } = parsed.data;

  try {
    await db.foodItem.update({ where: { id }, data: { ...rest, priceCents: price } });
  } catch (error) {
    console.error("updateFoodItem failed", error);
    return {
      message: "Could not save changes. The item may have been deleted.",
      values: formValues(formData),
    };
  }
  refreshMenu();
  redirect("/admin/food?notice=updated");
}

export async function deleteFoodItem(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    // Past orders keep their own copy of the name/price, so history is preserved.
    await db.foodItem.delete({ where: { id } });
  } catch (error) {
    console.error("deleteFoodItem failed", error);
    return { ok: false, message: "Could not delete the item. It may already be gone." };
  }
  refreshMenu();
  return { ok: true, message: "Item deleted." };
}

export async function setFoodAvailability(id: string, available: boolean): Promise<ActionResult> {
  await requireAdmin();
  if (typeof available !== "boolean") return { ok: false, message: "Invalid value." };
  try {
    await db.foodItem.update({ where: { id }, data: { available } });
  } catch (error) {
    console.error("setFoodAvailability failed", error);
    return { ok: false, message: "Could not update availability." };
  }
  refreshMenu();
  return { ok: true, message: available ? "Item is now available." : "Item marked unavailable." };
}
