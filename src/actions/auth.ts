"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DUMMY_HASH, hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession, requireAdmin } from "@/lib/auth/session";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import {
  changePasswordSchema,
  fieldErrorsOf,
  loginSchema,
  type FormState,
} from "@/lib/validation";

/** The example password from .env.example / README. */
const EXAMPLE_ADMIN_PASSWORD = "ChangeMe123!";

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values: { email } };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const limitKey = `login:${ip}:${parsed.data.email}`;
  const limit = rateLimit(limitKey, 5, 15 * 60_000);
  if (!limit.ok) {
    const minutes = Math.ceil(limit.retryAfterMs / 60_000);
    return {
      message: `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      values: { email },
    };
  }

  let admin;
  try {
    admin = await db.admin.findUnique({ where: { email: parsed.data.email } });
  } catch (error) {
    console.error("login lookup failed", error);
    return { message: "Something went wrong. Please try again.", values: { email } };
  }

  // Always run bcrypt so response time doesn't reveal whether the email exists.
  const valid = await verifyPassword(parsed.data.password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !valid) {
    return { message: "Incorrect email or password.", values: { email } };
  }

  resetRateLimit(limitKey);
  await createSession(admin.id, admin.tokenVersion);
  // Nudge admins still using the documented example password to change it.
  if (parsed.data.password === EXAMPLE_ADMIN_PASSWORD) {
    redirect("/admin/settings?notice=default-password");
  }
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

export async function changePassword(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const current = await requireAdmin();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };

  try {
    const admin = await db.admin.findUniqueOrThrow({ where: { id: current.id } });
    if (!(await verifyPassword(parsed.data.currentPassword, admin.passwordHash))) {
      return { fieldErrors: { currentPassword: ["Current password is incorrect"] } };
    }
    const updated = await db.admin.update({
      where: { id: admin.id },
      data: {
        passwordHash: await hashPassword(parsed.data.newPassword),
        tokenVersion: { increment: 1 }, // signs out every other session
      },
    });
    await createSession(updated.id, updated.tokenVersion);
    return { ok: true, message: "Password updated. Other sessions have been signed out." };
  } catch (error) {
    console.error("changePassword failed", error);
    return { message: "Could not update the password. Please try again." };
  }
}
