"use client";

import type { MenuItem } from "@/lib/data/food";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { FoodImage } from "@/components/ui/food-image";
import { PlusIcon } from "@/components/ui/icons";
import { QuantityStepper } from "./quantity-stepper";

export function MenuItemCard({
  item,
  quantity,
  onChange,
}: {
  item: MenuItem;
  quantity: number;
  onChange: (q: number) => void;
}) {
  const selected = quantity > 0;
  return (
    <div
      className={cn(
        "group flex gap-4 overflow-hidden rounded-3xl bg-white p-3 shadow-card ring-1 transition duration-300 hover:-translate-y-0.5 hover:shadow-float sm:flex-col sm:gap-0 sm:p-0",
        selected ? "ring-2 ring-ink" : "ring-line/60",
      )}
    >
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-none">
        <FoodImage
          src={item.image}
          alt={item.name}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col sm:p-4">
        <h3 className="font-semibold leading-snug">{item.name}</h3>
        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-sm text-muted">{item.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="font-semibold tabular-nums">{formatPrice(item.priceCents)}</span>
          {selected ? (
            <QuantityStepper value={quantity} onChange={onChange} label={item.name} />
          ) : (
            <button
              type="button"
              onClick={() => onChange(1)}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-stone-700"
              aria-label={`Add ${item.name}`}
            >
              <PlusIcon width={16} height={16} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
