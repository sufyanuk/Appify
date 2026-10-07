"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAllOrders } from "@/actions/admin-orders";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TrashIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toaster";

/** "Delete all orders" with a confirmation step. */
export function DeleteAllOrdersButton({ count }: { count: number }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function confirm() {
    startTransition(async () => {
      const result = await deleteAllOrders();
      setOpen(false);
      toast(result.message, result.ok ? "success" : "error");
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 self-start rounded-full px-4 text-sm font-medium text-red-700 ring-1 ring-red-200 transition-colors hover:bg-red-50 sm:self-auto"
      >
        <TrashIcon width={16} height={16} /> Delete all orders
      </button>
      <ConfirmDialog
        open={open}
        title="Delete all orders?"
        description={`All ${count} order${count === 1 ? "" : "s"} will be permanently removed, including their items and dashboard history. This can't be undone.`}
        confirmLabel={`Delete ${count} order${count === 1 ? "" : "s"}`}
        pending={pending}
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
