"use client";

import { useActionState } from "react";
import type { Recipe } from "@prisma/client";
import { Field, FormMessage, Input, Select, Textarea, errorProps } from "@/components/ui/field";
import { DIFFICULTIES } from "@/lib/constants";
import type { FormState } from "@/lib/validation";
import { FormActions } from "./form-actions";
import { ImageUrlField } from "./image-url-field";

export function RecipeForm({
  action,
  recipe,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  recipe?: Recipe;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};
  const v = (key: string, fallback: string) => state.values?.[key] ?? fallback;

  return (
    <form
      action={formAction}
      noValidate
      className="max-w-2xl space-y-5 rounded-2xl bg-white p-5 shadow-card ring-1 ring-line/60 sm:p-8"
    >
      <FormMessage message={state.message} />

      <Field label="Recipe name" htmlFor="name" errors={errors.name}>
        <Input
          id="name"
          name="name"
          required
          maxLength={100}
          defaultValue={v("name", recipe?.name ?? "")}
          placeholder="e.g. Fluffy Pancakes"
          {...errorProps("name", errors.name)}
        />
      </Field>

      <Field label="Short description" htmlFor="description" errors={errors.description}>
        <Textarea
          id="description"
          name="description"
          rows={2}
          maxLength={500}
          defaultValue={v("description", recipe?.description ?? "")}
          {...errorProps("description", errors.description)}
        />
      </Field>

      <ImageUrlField defaultValue={v("image", recipe?.image ?? "")} errors={errors.image} />

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Time (minutes)" htmlFor="cookingTime" errors={errors.cookingTime}>
          <Input
            id="cookingTime"
            name="cookingTime"
            type="number"
            inputMode="numeric"
            min={1}
            max={1440}
            required
            defaultValue={v("cookingTime", recipe ? String(recipe.cookingTime) : "")}
            {...errorProps("cookingTime", errors.cookingTime)}
          />
        </Field>
        <Field label="Servings" htmlFor="servings" errors={errors.servings}>
          <Input
            id="servings"
            name="servings"
            type="number"
            inputMode="numeric"
            min={1}
            max={50}
            required
            defaultValue={v("servings", String(recipe?.servings ?? 2))}
            {...errorProps("servings", errors.servings)}
          />
        </Field>
        <Field label="Difficulty" htmlFor="difficulty" errors={errors.difficulty}>
          <Select
            id="difficulty"
            name="difficulty"
            defaultValue={v("difficulty", recipe?.difficulty ?? "Easy")}
            {...errorProps("difficulty", errors.difficulty)}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Ingredients" htmlFor="ingredients" hint="One ingredient per line." errors={errors.ingredients}>
        <Textarea
          id="ingredients"
          name="ingredients"
          rows={7}
          required
          defaultValue={v("ingredients", recipe?.ingredients ?? "")}
          placeholder={"2 eggs\n1 cup milk\nPinch of salt"}
          {...errorProps("ingredients", errors.ingredients)}
        />
      </Field>

      <Field label="Instructions" htmlFor="instructions" hint="One step per line — they'll be numbered automatically." errors={errors.instructions}>
        <Textarea
          id="instructions"
          name="instructions"
          rows={8}
          required
          defaultValue={v("instructions", recipe?.instructions ?? "")}
          placeholder={"Whisk the eggs and milk.\nCook in a hot pan for 2 minutes."}
          {...errorProps("instructions", errors.instructions)}
        />
      </Field>

      <FormActions cancelHref="/admin/recipes" pending={pending} submitLabel={recipe ? "Save changes" : "Add recipe"} />
    </form>
  );
}
