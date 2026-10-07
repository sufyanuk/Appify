import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  SESSION_COOKIE,
  SESSION_DURATION_SECONDS,
  signSession,
  verifySessionToken,
} from "./jwt";

export async function createSession(adminId: string, tokenVersion: number) {
  const token = await signSession({ adminId, v: tokenVersion });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Returns the signed-in admin, or null. The token signature is verified AND the
 * admin is re-loaded from the database, so deleted admins or changed passwords
 * immediately invalidate old sessions. Memoised per request.
 */
export const getCurrentAdmin = cache(async () => {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  const admin = await db.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true, name: true, tokenVersion: true },
  });
  if (!admin || admin.tokenVersion !== session.v) return null;
  return admin;
});

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
