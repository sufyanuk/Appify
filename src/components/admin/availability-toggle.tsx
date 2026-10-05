"use client";

import { useOptimistic, useTransition } from "react";
import { setFoodAvailability } from "@/actions/admin-food";
import { cn } from "@/lib/cn";
import { useToast } from "@/components/ui/toaster";

/** Switch that marks a food item available / unavailable. */
export function AvailabilityToggle({
  id,
  name,
  available,
}: {
  id: string;
  name: string;
  available: boolean;
}) {
  const [optimistic, setOptimistic] = useOptimistic(available);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function toggle() {
    const next = !optimistic;
    startTransition(async () => {
      setOptimistic(next);
      const result = await setFoodAvailability(id, next);
      toast(result.ok ? `${name}: ${result.message}` : result.message, result.ok ? "success" : "error");
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label={`${name} available`}
      onClick={toggle}
      disabled={pending}
      className="group inline-flex min-h-10 items-center gap-2.5 text-sm"
    >
      <span
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          optimistic ? "bg-emerald-500" : "bg-stone-300",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
            optimistic ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </span>
      <span className={cn("font-medium", optimistic ? "text-emerald-700" : "text-muted")}>
        {optimistic ? "Available" : "Unavailable"}
      </span>
    </button>
  );
}
