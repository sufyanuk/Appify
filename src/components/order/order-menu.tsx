"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitOrder } from "@/actions/orders";
import type { MenuItem } from "@/lib/data/food";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import { XIcon } from "@/components/ui/icons";
import { cartActions, useCart } from "./cart-store";
import { MenuItemCard } from "./menu-item-card";
import { OrderSummary, type ContactErrors, type SummaryLine } from "./order-summary";
import { phoneField } from "@/lib/validation";

export function OrderMenu({ items }: { items: MenuItem[] }) {
  const router = useRouter();
  const cart = useCart();
  const [category, setCategory] = useState<string>("All");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const sheetRef = useRef<HTMLDialogElement>(null);

  const categories = useMemo(() => ["All", ...new Set(items.map((i) => i.category))], [items]);
  const visible = category === "All" ? items : items.filter((i) => i.category === category);

  // Only lines for items that are actually on the (available) menu count.
  const lines: SummaryLine[] = useMemo(
    () =>
      items
        .filter((i) => (cart[i.id] ?? 0) > 0)
        .map((i) => ({ id: i.id, name: i.name, priceCents: i.priceCents, quantity: cart[i.id] })),
    [items, cart],
  );
  const totalCents = lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  // Drop stale cart entries (item removed or made unavailable since last visit).
  useEffect(() => {
    const menuIds = new Set(items.map((i) => i.id));
    const stale = Object.keys(cart).filter((id) => !menuIds.has(id));
    if (stale.length) cartActions.remove(stale);
  }, [items, cart]);

  useEffect(() => {
    const dialog = sheetRef.current;
    if (!dialog) return;
    if (sheetOpen && !dialog.open) dialog.showModal();
    if (!sheetOpen && dialog.open) dialog.close();
  }, [sheetOpen]);

  function setQuantity(id: string, q: number) {
    setError(null);
    cartActions.setQuantity(id, q);
  }

  function validateContact(): ContactErrors {
    const errors: ContactErrors = {};
    if (customerName.trim().length < 2) errors.customerName = "Please enter your name";
    const phone = phoneField.safeParse(customerPhone);
    if (!phone.success) errors.customerPhone = phone.error.issues[0]?.message;
    return errors;
  }

  function handleSubmit() {
    if (lines.length === 0) {
      setError("Please add at least one item to your order.");
      return;
    }
    const errors = validateContact();
    setContactErrors(errors);
    if (errors.customerName || errors.customerPhone) {
      setError("Please add your name and contact number so we can reach you about your order.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitOrder({
        items: lines.map((l) => ({ id: l.id, quantity: l.quantity })),
        customerName,
        customerPhone,
        notes,
      });
      if (result.ok) {
        cartActions.clear();
        router.push(`/order/confirmation/${result.publicId}`);
        return;
      }
      setError(result.error);
      if (result.field) setContactErrors({ [result.field]: result.error });
      if (result.unavailableIds?.length) {
        cartActions.remove(result.unavailableIds);
        router.refresh();
      }
    });
  }

  const summary = (idPrefix: string) => (
    <OrderSummary
      idPrefix={idPrefix}
      lines={lines}
      totalCents={totalCents}
      customerName={customerName}
      customerPhone={customerPhone}
      notes={notes}
      error={error}
      contactErrors={contactErrors}
      pending={pending}
      onQuantityChange={setQuantity}
      onCustomerNameChange={(v) => {
        setCustomerName(v);
        setContactErrors((e) => ({ ...e, customerName: undefined }));
        setError(null);
      }}
      onCustomerPhoneChange={(v) => {
        setCustomerPhone(v);
        setContactErrors((e) => ({ ...e, customerPhone: undefined }));
        setError(null);
      }}
      onNotesChange={setNotes}
      onSubmit={handleSubmit}
    />
  );

  return (
    <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
      <div>
        {categories.length > 2 && (
          <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "h-10 shrink-0 rounded-full px-4 text-sm font-medium transition-colors",
                  category === c ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:bg-stone-50",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {visible.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={cart[item.id] ?? 0}
              onChange={(q) => setQuantity(item.id, q)}
            />
          ))}
        </div>
      </div>

      {/* Desktop: sticky order summary */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-card ring-1 ring-line/60">
          <h2 className="text-lg font-semibold">Your order</h2>
          {summary("desktop")}
        </div>
      </aside>

      {/* Mobile/tablet: bottom bar that opens the review sheet */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          disabled={itemCount === 0}
          className="flex h-14 w-full items-center justify-between rounded-full bg-ink px-6 text-white transition-colors disabled:bg-stone-300"
        >
          <span className="text-sm font-medium">
            {itemCount === 0 ? "Add items to start" : `Review order · ${itemCount} item${itemCount > 1 ? "s" : ""}`}
          </span>
          <span className="font-semibold tabular-nums">{formatPrice(totalCents)}</span>
        </button>
      </div>
      <div className="h-24 lg:hidden" aria-hidden="true" />

      <dialog
        ref={sheetRef}
        onClose={() => setSheetOpen(false)}
        onClick={(e) => e.target === sheetRef.current && setSheetOpen(false)}
        aria-labelledby="sheet-title"
        className="mx-auto mb-0 mt-auto max-h-[90dvh] w-full max-w-lg rounded-t-3xl bg-white p-0 text-ink shadow-float lg:hidden"
      >
        <div className="flex max-h-[90dvh] flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 id="sheet-title" className="text-lg font-semibold">
              Review your order
            </h2>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-100"
              aria-label="Close"
            >
              <XIcon />
            </button>
          </div>
          <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">
            {summary("mobile")}
          </div>
        </div>
      </dialog>
    </div>
  );
}
