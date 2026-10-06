"use client";

import { useState } from "react";
import { Field, Input, errorProps } from "@/components/ui/field";
import { FoodImage } from "@/components/ui/food-image";

/** Image URL input with a live preview. */
export function ImageUrlField({ defaultValue, errors }: { defaultValue: string; errors?: string[] }) {
  const [url, setUrl] = useState(defaultValue);
  return (
    <Field
      label="Image URL"
      htmlFor="image"
      hint="Paste a link to a photo of your dish, or a built-in illustration such as /images/dishes/solkadhi.svg. Leave empty for a placeholder."
      errors={errors}
    >
      <div className="flex items-start gap-3">
        <FoodImage
          src={/^https?:\/\/|^\//.test(url.trim()) ? url.trim() : ""}
          alt="Preview"
          className="h-11 w-11 shrink-0 rounded-xl text-lg"
        />
        <Input
          id="image"
          name="image"
          type="text"
          inputMode="url"
          placeholder="https://…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          {...errorProps("image", errors)}
        />
      </div>
    </Field>
  );
}
