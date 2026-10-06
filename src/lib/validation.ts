import { z } from "zod";
import {
  DIFFICULTIES,
  MAX_PRICE_CENTS,
  MAX_QUANTITY_PER_ITEM,
  ORDER_STATUSES,
} from "./constants";

/** Empty string, an http(s) URL, or a site-relative path like /images/x.jpg */
const imageField = z
  .string()
  .trim()
  .max(2000, "Image URL is too long")
  .refine(
    (v) => v === "" || v.startsWith("/") || /^https?:\/\/\S+$/i.test(v),
    "Image must be a valid http(s) URL",
  );

/** Accepts "250", "99.5" or "99.50" and converts rupees → integer paise. */
const priceField = z
  .string()
  .trim()
  .min(1, "Price is required")
  .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price, e.g. 250 or 99.50")
  .transform((v) => Math.round(Number(v) * 100))
  .refine((c) => c > 0, "Price must be greater than 0")
  .refine((c) => c <= MAX_PRICE_CENTS, "Price is too high");

const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal("")])
  .optional()
  .transform((v) => v === "on" || v === "true");

export const foodItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().trim().max(500, "Description is too long").default(""),
  price: priceField,
  image: imageField.default(""),
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category is too long"),
  available: checkbox,
});
export type FoodItemInput = z.infer<typeof foodItemSchema>;

export const recipeSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().trim().max(500, "Description is too long").default(""),
  image: imageField.default(""),
  ingredients: z
    .string()
    .trim()
    .min(1, "Add at least one ingredient")
    .max(5000, "Ingredients list is too long"),
  instructions: z
    .string()
    .trim()
    .min(1, "Add at least one step")
    .max(10000, "Instructions are too long"),
  cookingTime: z.coerce
    .number({ message: "Enter the time in minutes" })
    .int("Use whole minutes")
    .min(1, "Time must be at least 1 minute")
    .max(1440, "Time must be under 24 hours"),
  servings: z.coerce
    .number({ message: "Enter number of servings" })
    .int("Use a whole number")
    .min(1, "At least 1 serving")
    .max(50, "At most 50 servings"),
  difficulty: z.enum(DIFFICULTIES, { message: "Choose a difficulty" }),
});
export type RecipeInput = z.infer<typeof recipeSchema>;

/**
 * What the browser sends when submitting an order. Only ids and quantities —
 * prices are always looked up on the server.
 */
export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        quantity: z
          .number()
          .int("Quantity must be a whole number")
          .min(1, "Quantity must be at least 1")
          .max(MAX_QUANTITY_PER_ITEM, `Maximum ${MAX_QUANTITY_PER_ITEM} per item`),
      }),
    )
    .min(1, "Your order is empty")
    .max(100, "Too many items in one order"),
  customerName: z.string().trim().max(80, "Name is too long").default(""),
  notes: z.string().trim().max(500, "Notes are too long").default(""),
});
export type OrderInput = z.infer<typeof orderSchema>;

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required").max(200),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(10, "Use at least 10 characters")
      .max(200, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/** Shape returned by form server actions and consumed by useActionState. */
export type FormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};

/** Convert a zod error into per-field messages for the form. */
export function fieldErrorsOf(error: z.ZodError): FormState["fieldErrors"] {
  return z.flattenError(error).fieldErrors as FormState["fieldErrors"];
}

/** Read string values out of FormData (used to repopulate forms on error). */
export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  }
  return values;
}

/** Shape returned by simple (non-form) server actions such as delete/toggle. */
export type ActionResult = { ok: boolean; message: string };
