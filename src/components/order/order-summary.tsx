"use client";

import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { BagIcon } from "@/components/ui/icons";
import { QuantityStepper } from "./quantity-stepper";

export type SummaryLine = { id: string; name: string; priceCents: number; quantity: number };

/** "Your order" panel — used in the desktop sidebar and the mobile sheet. */
export function OrderSummary({
  lines,
  totalCents,
  customerName,
  notes,
  error,
  pending,
  onQuantityChange,
  onCustomerNameChange,
  onNotesChange,
  onSubmit,
  idPrefix,
}: {
  lines: SummaryLine[];
  totalCents: number;
  customerName: string;
  notes: string;
  error: string | null;
  pending: boolean;
  onQuantityChange: (id: string, q: number) => void;
  onCustomerNameChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onSubmit: () => void;
  idPrefix: string;
}) {
  const empty = lines.length === 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col"
    >
      {empty ? (
        <div className="flex flex-col items-center py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-muted">
            <BagIcon />
          </span>
          <p className="mt-3 font-medium">Your order is empty</p>
          <p className="mt-1 text-sm text-muted">Add items from the menu to get started.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {lines.map((line) => (
            <li key={line.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium">{line.name}</p>
                <p className="text-sm text-muted tabular-nums">
                  {formatPrice(line.priceCents)} × {line.quantity} ={" "}
                  <span className="text-ink">{formatPrice(line.priceCents * line.quantity)}</span>
                </p>
              </div>
              <QuantityStepper
                size="sm"
                value={line.quantity}
                onChange={(q) => onQuantityChange(line.id, q)}
                label={line.name}
              />
            </li>
          ))}
        </ul>
      )}

      {!empty && (
        <div className="mt-2 space-y-3 border-t border-line pt-4">
          <div>
            <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium">
              Name for the order <span className="font-normal text-muted">(optional)</span>
            </label>
            <Input
              id={`${idPrefix}-name`}
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              maxLength={80}
              autoComplete="given-name"
              placeholder="So we can call you when it's ready"
              className="mt-1.5"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-notes`} className="text-sm font-medium">
              Notes <span className="font-normal text-muted">(optional)</span>
            </label>
            <Textarea
              id={`${idPrefix}-notes`}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Allergies, no onions…"
              className="mt-1.5 resize-none"
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
        <span className="font-medium">Total</span>
        <span className="text-2xl font-semibold tabular-nums">{formatPrice(totalCents)}</span>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-4 w-full" disabled={empty || pending}>
        {pending ? "Submitting…" : "Submit order"}
      </Button>
      <p className="mt-2 text-center text-xs text-muted">No payment needed now — pay on collection.</p>
    </form>
  );
}
