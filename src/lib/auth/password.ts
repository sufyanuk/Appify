import "server-only";
import bcrypt from "bcryptjs";

const ROUNDS = 12;

export function hashPassword(password: string) {
  return bcrypt.hash(password, ROUNDS);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// A valid hash of a random string, used to keep login timing constant when the
// email does not exist (prevents user enumeration via response time).
export const DUMMY_HASH =
  "$2b$12$u9VKUhfBT/HvqmbiIChj9ellQvQvPQPt1xQDPSH6PRAflOwG/pEVi";
