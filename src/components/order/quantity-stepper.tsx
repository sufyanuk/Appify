"use client";

import { cn } from "@/lib/cn";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/constants";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

/** Large, thumb-friendly − / + control (44px touch targets). */
export function QuantityStepper({
  value,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const btn = cn(
    "flex items-center justify-center rounded-full transition-colors disabled:opacity-40",
    size === "md" ? "h-11 w-11" : "h-9 w-9",
  );
  return (
    <div
      role="group"
      aria-label={`Quantity for ${label}`}
      className="inline-flex items-center rounded-full bg-stone-100 p-0.5"
    >
      <button
        type="button"
        className={cn(btn, "hover:bg-white")}
        onClick={() => onChange(value - 1)}
        aria-label={value === 1 ? `Remove ${label}` : `Decrease ${label}`}
        disabled={value <= 0}
      >
        <MinusIcon width={18} height={18} />
      </button>
      <span
        className={cn("text-center font-semibold tabular-nums", size === "md" ? "w-8" : "w-7 text-sm")}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={cn(btn, "bg-ink text-white hover:bg-stone-700")}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${label}`}
        disabled={value >= MAX_QUANTITY_PER_ITEM}
      >
        <PlusIcon width={18} height={18} />
      </button>
    </div>
  );
}
