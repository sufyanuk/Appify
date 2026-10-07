// Session token helpers. Kept free of Node-only imports so it can also be used
// from the proxy (src/proxy.ts).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "appify_admin_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  adminId: string;
  /** Matches Admin.tokenVersion; changes when the password changes. */
  v: number;
};

/** The example value from .env.example — public, so never safe to use in production. */
const EXAMPLE_SECRET = "replace-me-with-a-long-random-string-of-32-plus-chars";
let warnedAboutExample = false;

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a random string of 32+ characters in your environment.",
    );
  }
  if (secret === EXAMPLE_SECRET) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SESSION_SECRET is still the example value from .env.example. Generate a real one with: openssl rand -base64 32",
      );
    }
    if (!warnedAboutExample) {
      warnedAboutExample = true;
      console.warn(
        "⚠ SESSION_SECRET is the example value from .env.example. Fine for local testing, but set a real secret before deploying.",
      );
    }
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getKey());
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    if (typeof payload.adminId !== "string" || typeof payload.v !== "number") {
      return null;
    }
    return { adminId: payload.adminId, v: payload.v };
  } catch {
    return null;
  }
}
