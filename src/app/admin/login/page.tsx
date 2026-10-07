import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/site/site-header";
import { getCurrentAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Logo />
      <div className="mt-8 w-full max-w-sm rounded-3xl bg-white p-6 shadow-card ring-1 ring-line/60 sm:p-8">
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted">Manage your menu, recipes and orders.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
      <Link href="/" className="mt-6 text-sm text-muted hover:text-ink">
        ← Back to the site
      </Link>
    </main>
  );
}
