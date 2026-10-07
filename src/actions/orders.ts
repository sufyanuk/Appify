"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/constants";
import { rateLimit } from "@/lib/rate-limit";
import { orderSchema } from "@/lib/validation";

export type SubmitOrderResult =
  | { ok: true; publicId: string; orderNumber: string }
  | {
      ok: false;
      error: string;
      unavailableIds?: string[];
      /** Set when the problem is with one of the contact fields. */
      field?: "customerName" | "customerPhone";
    };

/**
 * Public action: anyone can place an order (no account needed).
 * The client only sends item ids + quantities. Names, prices and the total are
 * always taken from the database here — never trusted from the browser.
 */
export async function submitOrder(input: unknown): Promise<SubmitOrderResult> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`order:${ip}`, 10, 60_000).ok) {
    return { ok: false, error: "Too many orders in a short time. Please wait a minute and try again." };
  }

  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path[0];
    return {
      ok: false,
      error: issue?.message ?? "Invalid order.",
      field: field === "customerName" || field === "customerPhone" ? field : undefined,
    };
  }
  const { customerName, customerPhone, notes } = parsed.data;

  // Merge duplicate lines for the same item.
  const quantities = new Map<string, number>();
  for (const { id, quantity } of parsed.data.items) {
    quantities.set(id, (quantities.get(id) ?? 0) + quantity);
  }
  if ([...quantities.values()].some((q) => q > MAX_QUANTITY_PER_ITEM)) {
    return { ok: false, error: `You can order at most ${MAX_QUANTITY_PER_ITEM} of each item.` };
  }

  try {
    const ids = [...quantities.keys()];
    const foodItems = await db.foodItem.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, priceCents: true, available: true },
    });
    const byId = new Map(foodItems.map((f) => [f.id, f]));

    const unavailableIds = ids.filter((id) => !byId.get(id)?.available);
    if (unavailableIds.length > 0) {
      const names = unavailableIds.map((id) => byId.get(id)?.name).filter(Boolean);
      return {
        ok: false,
        unavailableIds,
        error: names.length
          ? `Sorry, ${names.join(", ")} ${names.length > 1 ? "are" : "is"} no longer available. We've removed it from your order.`
          : "Some items in your order are no longer on the menu. We've removed them from your order.",
      };
    }

    const lines = ids.map((id) => {
      const item = byId.get(id)!;
      const quantity = quantities.get(id)!;
      return {
        foodItemId: item.id,
        name: item.name,
        unitPriceCents: item.priceCents,
        quantity,
        lineTotalCents: item.priceCents * quantity,
      };
    });
    const totalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);

    const order = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          // Temporary unique value; replaced below once we know the sequential id.
          orderNumber: `TMP-${crypto.randomUUID()}`,
          customerName,
          customerPhone,
          notes,
          totalCents,
          items: { create: lines },
        },
        select: { id: true },
      });
      return tx.order.update({
        where: { id: created.id },
        data: { orderNumber: `ORD-${1000 + created.id}` },
        select: { publicId: true, orderNumber: true },
      });
    });

    revalidatePath("/admin", "layout");
    return { ok: true, publicId: order.publicId, orderNumber: order.orderNumber };
  } catch (error) {
    console.error("submitOrder failed", error);
    return { ok: false, error: "We couldn't save your order right now. Please try again." };
  }
}
