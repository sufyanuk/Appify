/**
 * Create an admin, or reset an existing admin's password.
 *
 *   npm run admin:create -- admin@example.com "a-strong-password"
 *
 * Falls back to ADMIN_EMAIL / ADMIN_PASSWORD from .env when no args are given.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = (process.argv[2] ?? process.env.ADMIN_EMAIL)?.trim().toLowerCase();
  const password = process.argv[3] ?? process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Usage: npm run admin:create -- <email> "<password>"');
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.admin.upsert({
    where: { email },
    create: { email, passwordHash },
    // Bumping tokenVersion signs out any existing sessions for this admin.
    update: { passwordHash, tokenVersion: { increment: 1 } },
  });
  console.log(`✔ Admin ${email} is ready. Sign in at /admin/login`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
