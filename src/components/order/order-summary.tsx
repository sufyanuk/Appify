"use client";

import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input, Textarea, errorProps } from "@/components/ui/field";
import { BagIcon, WhatsAppIcon } from "@/components/ui/icons";
import { QuantityStepper } from "./quantity-stepper";

export type SummaryLine = { id: string; name: string; priceCents: number; quantity: number };
export type ContactErrors = { customerName?: string; customerPhone?: string };

/** "Your order" panel — used in the desktop sidebar and the mobile sheet. */
export function OrderSummary({
  lines,
  totalCents,
  customerName,
  customerPhone,
  notes,
  error,
  contactErrors,
  pending,
  onQuantityChange,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onNotesChange,
  onSubmit,
  whatsAppHref,
  idPrefix,
}: {
  lines: SummaryLine[];
  totalCents: number;
  customerName: string;
  customerPhone: string;
  notes: string;
  error: string | null;
  contactErrors: ContactErrors;
  pending: boolean;
  onQuantityChange: (id: string, q: number) => void;
  onCustomerNameChange: (v: string) => void;
  onCustomerPhoneChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  onSubmit: () => void;
  /** wa.me link with the order pre-filled (null when the cart is empty). */
  whatsAppHref: string | null;
  idPrefix: string;
}) {
  const empty = lines.length === 0;

  return (
    <form
      noValidate
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
              Your name <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <Input
              id={`${idPrefix}-name`}
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              maxLength={80}
              required
              autoComplete="name"
              placeholder="e.g. Priya Sawant"
              className="mt-1.5"
              {...errorProps(`${idPrefix}-name`, toList(contactErrors.customerName))}
            />
            <FieldErrorText id={`${idPrefix}-name`} message={contactErrors.customerName} />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-phone`} className="text-sm font-medium">
              Contact number <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <Input
              id={`${idPrefix}-phone`}
              type="tel"
              inputMode="tel"
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange(e.target.value)}
              maxLength={25}
              required
              autoComplete="tel"
              placeholder="e.g. +974 5555 1234"
              className="mt-1.5"
              {...errorProps(`${idPrefix}-phone`, toList(contactErrors.customerPhone))}
            />
            <FieldErrorText id={`${idPrefix}-phone`} message={contactErrors.customerPhone} />
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
              placeholder="Spice level, allergies, delivery area…"
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
      {whatsAppHref && (
        <>
          <div className="my-3 flex items-center gap-3 text-xs text-muted" aria-hidden="true">
            <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
          </div>
          <a
            href={whatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1fa855] px-6 text-base font-medium text-white transition-colors hover:bg-[#178a45] focus-visible:outline-[#1fa855]"
          >
            <WhatsAppIcon width={22} height={22} /> Order via WhatsApp
          </a>
        </>
      )}
      <p className="mt-2 text-center text-xs text-muted">No payment needed now — pay on delivery or collection.</p>
    </form>
  );
}

function FieldErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
      {message}
    </p>
  );
}

const toList = (message?: string) => (message ? [message] : undefined);
