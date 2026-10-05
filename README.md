# Appify — Easy Recipes & Food Ordering

A simple, modern web app with two jobs:

1. **Browse easy recipes**: ingredients, numbered steps, time and difficulty.
2. **Order food**: choose items and quantities, review, submit, get an order number. No account and no payment needed.

There's also a protected **Admin Dashboard** where you manage the menu, recipes and orders without touching code.

---

## Tech stack

| Layer      | Choice                                                         | Why |
| ---------- | -------------------------------------------------------------- | --- |
| Framework  | **Next.js 16** (App Router, React 19, Server Actions)          | Frontend and backend in one project. No separate API server to deploy. |
| Language   | **TypeScript**                                                 | Catches mistakes early and makes the code easier to follow. |
| Styling    | **Tailwind CSS v4**                                            | Fast, consistent, responsive styling with no CSS files to maintain. |
| Database   | **Prisma ORM** + **SQLite** locally, **PostgreSQL** in production | Local setup needs nothing installed. Moving to Postgres is a one-line change. |
| Validation | **Zod**                                                        | Every input is validated on the server. |
| Auth       | **bcrypt** password hashes + signed **JWT in an httpOnly cookie** (`jose`) | Simple and secure, with no third-party auth service. |

---

## Running it locally

Requirements: **Node.js 20+**.

```bash
npm install            # install dependencies (also generates the Prisma client)
cp .env.example .env   # then edit .env and set SESSION_SECRET (see below)
npm run setup          # create the database tables and load sample data + admin user
npm run dev            # start the app at http://localhost:3000
```

| URL                                  | What                                       |
| ------------------------------------ | ------------------------------------------ |
| http://localhost:3000                | Home page                                  |
| http://localhost:3000/recipes        | Easy recipes                               |
| http://localhost:3000/order          | Order food                                 |
| http://localhost:3000/admin          | Admin dashboard (redirects to login)       |

### Useful scripts

| Command                                         | Purpose |
| ----------------------------------------------- | ------- |
| `npm run dev`                                   | Start the dev server |
| `npm run build && npm start`                    | Production build and server |
| `npm run setup`                                 | Create tables and seed sample data (safe to re-run) |
| `npm run db:studio`                             | Browse and edit the database in a visual UI |
| `npm run admin:create -- you@site.com "pass"`   | Create an admin, or reset an admin's password |
| `npm run lint` / `npm run typecheck`            | Code quality checks |

---

## Environment variables

| Variable          | Required | Description |
| ----------------- | -------- | ----------- |
| `DATABASE_URL`    | yes      | `file:./dev.db` for local SQLite, or a `postgresql://…` URL in production. |
| `SESSION_SECRET`  | yes      | Random string, **at least 32 characters**, used to sign admin sessions. Generate one with `openssl rand -base64 32`. |
| `ADMIN_EMAIL`     | for seeding | Email of the first admin, created by `npm run setup` / `npm run db:seed`. |
| `ADMIN_PASSWORD`  | for seeding | Password of the first admin. **Change it after your first login.** |

All secrets stay on the server. Nothing is exposed to the browser (there are no `NEXT_PUBLIC_` variables).

---

## Admin: creating an account and logging in

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. The example values are `admin@example.com` / `ChangeMe123!`.
2. Run `npm run setup`, or `npm run admin:create`. This creates the admin with a bcrypt-hashed password.
3. Open **http://localhost:3000/admin** and sign in. The site footer also has a "Staff login" link.
4. Choose your own password under **Settings → Change password**. If you sign in with the example password, the app takes you there automatically and shows a reminder.

To add another admin or reset a forgotten password:

```bash
npm run admin:create -- someone@example.com "a-new-strong-password"
```

### What you can do in the dashboard

- **Dashboard:** total orders, pending orders, available items, revenue, recent orders, quick links.
- **Food items:** add, edit or delete items (deleting asks you to confirm first). Use the **Available** switch to hide an item from customers without deleting it.
- **Orders:** see every order with date, items, quantities and total. Filter by status and change the status (Received → Preparing → Ready → Completed / Cancelled). Customers see the new status on their confirmation page.
- **Recipes:** add, edit and delete recipes. Ingredients and steps are entered one per line.
- **Settings:** change your password. This signs out your other sessions.

---

## Project structure

```
prisma/
  schema.prisma          Database tables (FoodItem, Order, OrderItem, Recipe, Admin)
  seed.ts                Sample menu, recipes and first admin
scripts/
  create-admin.ts        CLI to create an admin or reset a password
src/
  proxy.ts               Redirects /admin/* to login when there's no valid session cookie
  actions/               Server Actions (the "API"): every mutation lives here
    orders.ts            submitOrder (public, computes prices and total on the server)
    auth.ts              login / logout / changePassword
    admin-food.ts        create / update / delete / toggle availability
    admin-recipes.ts     create / update / delete recipes
    admin-orders.ts      update order status
  app/
    (site)/              Public pages, sharing the customer header and footer
      page.tsx           Home: the two big choices
      recipes/           Recipe list and recipe detail
      order/             Menu, cart, and confirmation/[publicId]
    admin/
      login/             Admin sign-in
      (dashboard)/       Protected area: layout checks the session
        page.tsx         Dashboard
        food/ orders/ recipes/ settings/
  components/
    ui/                  Reusable building blocks (Button, Field, Badge, Toaster, ConfirmDialog…)
    order/               Menu cards, quantity stepper, cart store, order summary
    recipes/             Recipe card
    admin/               Admin forms, tables, toggles, delete button
    site/                Header, footer, page header
  lib/
    db.ts                Prisma client
    auth/                Session (JWT cookie), password hashing
    data/                Read-only database queries used by pages
    validation.ts        Zod schemas shared by all actions
    constants.ts, format.ts, rate-limit.ts, cn.ts
```

---

## Database structure

| Table         | Columns |
| ------------- | ------- |
| **FoodItem**  | `id`, `name`, `description`, `priceCents`, `image`, `category`, `available`, `createdAt`, `updatedAt` |
| **Order**     | `id` (sequential), `publicId` (unguessable, used in the confirmation URL), `orderNumber` (e.g. `ORD-1024`), `customerName`, `notes`, `totalCents`, `status`, `createdAt`, `updatedAt` |
| **OrderItem** | `id`, `orderId`, `foodItemId` (nullable), `name`, `unitPriceCents`, `quantity`, `lineTotalCents` |
| **Recipe**    | `id`, `name`, `description`, `image`, `ingredients` (one per line), `instructions` (one per line), `cookingTime` (minutes), `servings`, `difficulty`, `createdAt`, `updatedAt` |
| **Admin**     | `id`, `email`, `name`, `passwordHash` (bcrypt), `tokenVersion`, `createdAt`, `updatedAt` |

Design notes:

- **Prices are stored as integer cents**, so there are no floating-point rounding errors.
- **Each order line stores its own copy of the name and price** at the time of ordering. Editing or deleting a menu item never changes past orders.
- Order items live in their own table instead of a JSON blob, which makes reporting easy later.

---

## Security

- **Admin routes are protected twice.** `src/proxy.ts` redirects requests that have no validly signed cookie. The admin layout, every admin page and **every admin server action** call `requireAdmin()`, which verifies the token **and** re-checks the admin in the database.
- **Prices and totals come from the server.** The browser sends only item ids and quantities. The server looks up current prices, rejects unavailable items, caps quantities (1–50 per item) and calculates the total.
- **All input is validated server-side** with Zod: price format, required fields, quantity ranges, status values, URL format.
- **Passwords** are hashed with bcrypt (12 rounds). Login has constant-time behaviour for unknown emails and is rate-limited (5 failed attempts per 15 minutes).
- **Sessions** are httpOnly, `SameSite=Lax`, `Secure` in production and expire after 8 hours. Changing your password invalidates all other sessions.
- **Order confirmation URLs** use an unguessable id, so customers can't browse each other's orders by changing `ORD-1024` to `ORD-1025`.
- **Secrets** live only in environment variables, and `.env` is git-ignored.
- **The example `SESSION_SECRET` from `.env.example` is refused in production.** It is public, so admin sign-in stays blocked until you set a real secret. In development it only logs a warning.

---

## Deploying (recommended: Vercel + Neon/Supabase Postgres)

SQLite is a local file, so it isn't suitable for serverless hosting. Use a hosted PostgreSQL instead:

1. **Create a Postgres database** on [Neon](https://neon.tech), [Supabase](https://supabase.com) or [Railway](https://railway.app). The free tiers are fine. Copy its connection string.
2. **Switch the provider** in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. **Create the tables and seed** from your machine, pointing at the production database:
   ```bash
   DATABASE_URL="postgresql://…" ADMIN_EMAIL="you@site.com" ADMIN_PASSWORD="a-strong-password" npm run setup
   ```
4. **Push to GitHub and import the repo in [Vercel](https://vercel.com).** Add the environment variables `DATABASE_URL` and `SESSION_SECRET` in the Vercel project settings, then deploy. The build script already runs `prisma generate`.

You can also deploy to any Node host (Railway, Render, Fly.io, a VPS) with `npm run build && npm start`. On a single server with a persistent disk, SQLite works fine too.

---

## Possible future improvements

- **Image uploads.** Admins currently paste an image URL. Uploads could go to Vercel Blob, S3 or Supabase Storage.
- **Live order updates.** The admin orders list and the customer confirmation page could poll for or stream status changes.
- **Shared rate limiting.** Swap the in-memory limiter for Upstash Redis when running on multiple instances.
- **Order notifications.** Email or SMS the kitchen when an order arrives, and the customer when it's ready.
- **Pickup times, tables or delivery addresses**, if the business needs them.
- **Optional online payments** (e.g. Stripe Checkout) later on.
- **Database migrations.** Switch from `prisma db push` to `prisma migrate` once the schema stabilises in production.
- **Automated tests** (Playwright end-to-end, Vitest unit tests) in CI.
- **Multiple admin roles** (e.g. kitchen staff who can only update order status).
