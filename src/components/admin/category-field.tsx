"use client";

import { useState } from "react";
import { Input, Select, errorProps } from "@/components/ui/field";

const NEW_CATEGORY = "__new__";

/**
 * A real dropdown of menu sections, with an "Add a new category…" option that
 * switches to a text box. Submits a single `category` field either way.
 */
export function CategoryField({
  categories,
  defaultValue,
  errors,
}: {
  categories: string[];
  defaultValue: string;
  errors?: string[];
}) {
  // Make sure the item's current category is always selectable.
  const options = defaultValue && !categories.includes(defaultValue) ? [...categories, defaultValue] : categories;
  const [custom, setCustom] = useState(false);

  if (custom) {
    return (
      <div className="space-y-1.5">
        <Input
          id="category"
          name="category"
          required
          maxLength={50}
          autoFocus
          placeholder="New category name"
          {...errorProps("category", errors)}
        />
        <button
          type="button"
          onClick={() => setCustom(false)}
          className="text-xs font-medium text-brand-600 hover:underline"
        >
          ← Choose an existing category
        </button>
      </div>
    );
  }

  return (
    // Uncontrolled on purpose: React resets forms after a server action, and
    // defaultValue lets that reset restore the right option (e.g. after a
    // validation error the form re-renders with the submitted category).
    <Select
      key={defaultValue}
      id="category"
      name="category"
      required
      defaultValue={defaultValue || options[0]}
      onChange={(e) => {
        if (e.target.value === NEW_CATEGORY) setCustom(true);
      }}
      {...errorProps("category", errors)}
    >
      {options.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
      <option value={NEW_CATEGORY}>+ Add a new category…</option>
    </Select>
  );
}
