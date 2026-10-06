"use client";

import { useActionState } from "react";
import type { FoodItem } from "@prisma/client";
import { Field, FormMessage, Input, Textarea, errorProps } from "@/components/ui/field";
import { centsToInput } from "@/lib/format";
import type { FormState } from "@/lib/validation";
import { FormActions } from "./form-actions";
import { ImageUrlField } from "./image-url-field";

export function FoodForm({
  action,
  item,
  categories,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  item?: FoodItem;
  categories: string[];
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};
  // After a failed submit, show what the admin typed; otherwise the saved values.
  const v = (key: string, fallback: string) => state.values?.[key] ?? fallback;
  const available = state.values ? state.values.available === "on" : (item?.available ?? true);

  return (
    <form
      action={formAction}
      noValidate
      className="max-w-2xl space-y-5 rounded-2xl bg-white p-5 shadow-card ring-1 ring-line/60 sm:p-8"
    >
      <FormMessage message={state.message} />

      <Field label="Item name" htmlFor="name" errors={errors.name}>
        <Input
          id="name"
          name="name"
          required
          maxLength={100}
          defaultValue={v("name", item?.name ?? "")}
          placeholder="e.g. Kombdi Vade"
          {...errorProps("name", errors.name)}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Price (₹)" htmlFor="price" errors={errors.price}>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted">₹</span>
            <Input
              id="price"
              name="price"
              inputMode="decimal"
              required
              defaultValue={v("price", item ? centsToInput(item.priceCents) : "")}
              placeholder="0"
              className="pl-7"
              {...errorProps("price", errors.price)}
            />
          </div>
        </Field>

        <Field label="Category" htmlFor="category" errors={errors.category}>
          <Input
            id="category"
            name="category"
            list="category-options"
            required
            maxLength={50}
            defaultValue={v("category", item?.category ?? "")}
            placeholder="e.g. Seafood"
            {...errorProps("category", errors.category)}
          />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
      </div>

      <Field label="Description" htmlFor="description" hint="Optional — one short sentence works best." errors={errors.description}>
        <Textarea
          id="description"
          name="description"
          rows={3}
          maxLength={500}
          defaultValue={v("description", item?.description ?? "")}
          {...errorProps("description", errors.description)}
        />
      </Field>

      <ImageUrlField defaultValue={v("image", item?.image ?? "")} errors={errors.image} />

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4">
        <input
          type="checkbox"
          name="available"
          defaultChecked={available}
          className="mt-0.5 h-5 w-5 rounded accent-ink"
        />
        <span>
          <span className="block text-sm font-medium">Available to order</span>
          <span className="block text-xs text-muted">Uncheck to hide this item from customers without deleting it.</span>
        </span>
      </label>

      <FormActions cancelHref="/admin/food" pending={pending} submitLabel={item ? "Save changes" : "Add item"} />
    </form>
  );
}
