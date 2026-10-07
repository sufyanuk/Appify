"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TrashIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toaster";
import type { ActionResult } from "@/lib/validation";

/** Trash button that asks for confirmation before calling a (bound) server action. */
export function DeleteButton({
  action,
  itemName,
  title = "Delete item?",
}: {
  action: () => Promise<ActionResult>;
  itemName: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function confirm() {
    startTransition(async () => {
      const result = await action();
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
        className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-600"
        aria-label={`Delete ${itemName}`}
        title="Delete"
      >
        <TrashIcon width={18} height={18} />
      </button>
      <ConfirmDialog
        open={open}
        title={title}
        description={`“${itemName}” will be permanently removed. This can't be undone.`}
        pending={pending}
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
