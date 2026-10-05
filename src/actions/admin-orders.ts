"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { orderStatusSchema, type ActionResult } from "@/lib/validation";

export async function updateOrderStatus(orderId: number, status: string): Promise<ActionResult> {
  await requireAdmin();
  const parsed = orderStatusSchema.safeParse(status);
  if (!parsed.success || !Number.isInteger(orderId)) {
    return { ok: false, message: "Invalid status." };
  }
  try {
    const order = await db.order.update({
      where: { id: orderId },
      data: { status: parsed.data },
      select: { orderNumber: true, publicId: true },
    });
    revalidatePath("/admin", "layout");
    revalidatePath(`/order/confirmation/${order.publicId}`);
    return {
      ok: true,
      message: `${order.orderNumber} marked as ${ORDER_STATUS_LABELS[parsed.data]}.`,
    };
  } catch (error) {
    console.error("updateOrderStatus failed", error);
    return { ok: false, message: "Could not update the order status." };
  }
}
