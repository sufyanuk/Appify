"use client";

import { useOptimistic, useTransition } from "react";
import { updateOrderStatus } from "@/actions/admin-orders";
import { cn } from "@/lib/cn";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";
import { useToast } from "@/components/ui/toaster";

const tone: Record<OrderStatus, string> = {
  RECEIVED: "bg-sky-50 text-sky-800 border-sky-200",
  PREPARING: "bg-amber-50 text-amber-800 border-amber-200",
  READY: "bg-brand-50 text-brand-700 border-brand-200",
  COMPLETED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export function StatusSelect({
  orderId,
  orderNumber,
  status,
}: {
  orderId: number;
  orderNumber: string;
  status: string;
}) {
  const [optimistic, setOptimistic] = useOptimistic(status as OrderStatus);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  return (
    <select
      aria-label={`Status for ${orderNumber}`}
      value={optimistic}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        startTransition(async () => {
          setOptimistic(next);
          const result = await updateOrderStatus(orderId, next);
          toast(result.message, result.ok ? "success" : "error");
        });
      }}
      className={cn(
        "h-10 cursor-pointer rounded-full border px-3 pr-8 text-sm font-medium focus:outline-none disabled:opacity-60",
        tone[optimistic] ?? "border-line bg-white",
      )}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
