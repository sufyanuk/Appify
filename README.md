# Kokni Jevan (कोकणी जेवण): Homemade Kokni Food in Qatar

A simple, mobile-friendly web app for a home kitchen serving Kokni (Konkan, Maharashtra) food. It has two jobs:

1. **Browse easy recipes**: simple Kokni dishes such as solkadhi, ghavane and kolambi fry, with ingredients, numbered steps, time and difficulty.
2. **Order homemade food**: Malvani fish thali, kombdi vade, surmai fry, modak and more. Choose quantities, give your **name and contact number** (both required), submit and get an order number. No account and no online payment needed (pay on delivery or collection). Prices are in **Qatari riyals (QAR)** and times are shown in Qatar time.

There's also a protected **Admin Dashboard** where you manage the menu, recipes and orders without touching code.

---

## Tech stack

| Layer      | Choice                                                         | Why |
| ---------- | -------------------------------------------------------------- | --- |
| Framework  | **Next.js 16** (App Router, React 19, Server Actions)          | Frontend and backend in one project. No separate API server to deploy. |
| Language   | **TypeScript**                                                 | Catches mistakes early and makes the code easier to follow. |
| Styling    | **Tailwind CSS v4**                                            | Fast, consistent, responsive styling with no CSS files to maintain. |
| Database   | **Prisma ORM** + **PostgreSQL**                                | Reliable, free hosted options (Neon, Supabase, Prisma Postgres), and it works on Vercel. |
| Validation | **Zod**                                                        | Every input is validated on the server. |
| Auth       | **bcrypt** password hashes + signed **JWT in an httpOnly cookie** (`jose`) | Simple and secure, with no third-party auth service. |

---

## Running it locally

Requirements: **Node.js 20+** and a **PostgreSQL** database. Either option works:

- **Easiest:** a free hosted database from [Neon](https://neon.tech). Create a project and copy its connection string.
- **Local:** with Docker, run `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=appify postgres:16`. This matches the default `DATABASE_URL` in `.env.example`.

```bash
npm install            # install dependencies (also generates the Prisma client)
cp .env.example .env   # then edit .env: set DATABASE_URL and SESSION_SECRET (see below)
npm run setup          # create the database tables and load the sample Kokni menu, recipes + admin user
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
| `DATABASE_URL`    | yes      | PostgreSQL connection string (`postgresql://…`). On Vercel it's added for you when you connect a database. |
| `SESSION_SECRET`  | yes      | Random string, **at least 32 characters**, used to sign admin sessions. Generate one with `openssl rand -base64 32`. |
| `ADMIN_EMAIL`     | for seeding | Email of the first admin, created by `npm run setup` / `npm run db:seed`. |
| `ADMIN_PASSWORD`  | for seeding | Password of the first admin. **Change it after your first login.** |
| `ADMIN_RENAME_FROM` | optional | An existing admin email to rename to `ADMIN_EMAIL` on the next seed or deploy. The password is kept. |

All secrets stay on the server. Nothing is exposed to the browser (there are no `NEXT_PUBLIC_` variables).

---

## Admin: creating an account and logging in

1. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. The example values are `admin@example.com` / `ChangeMe123!`.
2. Run `npm run setup`, or `npm run admin:create`. This creates the admin with a bcrypt-hashed password.
3. Open **http://localhost:3000/admin** and sign in. The site footer also has an "Admin login" link.
4. Choose your own password under **Settings → Change password**. If you sign in with the example password, the app takes you there automatically and shows a reminder.

To add another admin or reset a forgotten password:

```bash
npm run admin:create -- someone@example.com "a-new-strong-password"
```

To change an existing admin's login email but keep their password, set `ADMIN_EMAIL` to the new address and `ADMIN_RENAME_FROM` to the old one, then run `npm run db:seed` (on Vercel, just redeploy).

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
| **Order**     | `id` (sequential), `publicId` (unguessable, used in the confirmation URL), `orderNumber` (e.g. `ORD-1024`), `customerName`, `customerPhone`, `notes`, `totalCents`, `status`, `createdAt`, `updatedAt` |
| **OrderItem** | `id`, `orderId`, `foodItemId` (nullable), `name`, `unitPriceCents`, `quantity`, `lineTotalCents` |
| **Recipe**    | `id`, `name`, `description`, `image`, `ingredients` (one per line), `instructions` (one per line), `cookingTime` (minutes), `servings`, `difficulty`, `createdAt`, `updatedAt` |
| **Admin**     | `id`, `email`, `name`, `passwordHash` (bcrypt), `tokenVersion`, `createdAt`, `updatedAt` |

Design notes:

- **Prices are stored as whole numbers of dirhams** (QAR 1 = 100 dirhams), so there are no floating-point rounding errors.
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

## Deploying to Vercel

The project includes a `vercel-build` script. On every deploy it creates or updates the database tables (`prisma db push`), adds the sample data and first admin if they're missing, then builds the app. You don't need to run any commands yourself.

1. **Import the GitHub repo** in [Vercel](https://vercel.com/new).
2. **Add a database.** In the project, go to **Storage → Create Database → Neon** (free tier), connect it to the project for Production and Preview, and Vercel adds `DATABASE_URL` for you.
3. **Add environment variables** under **Settings → Environment Variables**:
   - `SESSION_SECRET`: from `openssl rand -base64 32`.
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD`: your first admin login. Change the password in Admin → Settings after you sign in.
4. **Set the Build Command** under **Settings → Build & Deployment** to `npm run vercel-build`, then **redeploy**.

Any other Node host (Railway, Render, Fly.io, a VPS) works too: run `npm run setup` once against the database, then `npm run build && npm start`.

---

## Possible future improvements

- **Your own photos.** The sample dishes use real, freely licensed photos from Wikimedia Commons (credited on `/credits`, listed in `src/lib/photos.ts`). Replacing them with photos of your own cooking (paste a link in Admin → Food items) makes the menu more authentic. Direct uploads could go to Vercel Blob.
- **A delivery address field** on the order form. Customers can already add this in the order notes.
- **Live order updates.** The admin orders list and the customer confirmation page could poll for or stream status changes.
- **Shared rate limiting.** Swap the in-memory limiter for Upstash Redis when running on multiple instances.
- **Order notifications.** Email or SMS the kitchen when an order arrives, and the customer when it's ready.
- **Pickup times, tables or delivery addresses**, if the business needs them.
- **Optional online payments** (e.g. Stripe Checkout) later on.
- **Database migrations.** Switch from `prisma db push` to `prisma migrate` once the schema stabilises in production.
- **Automated tests** (Playwright end-to-end, Vitest unit tests) in CI.
- **Multiple admin roles** (e.g. kitchen staff who can only update order status).
