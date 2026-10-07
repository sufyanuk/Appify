import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/site/site-header";
import { LogoutIcon } from "@/components/ui/icons";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · Kokni Jevan" },
  robots: { index: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="flex w-full flex-1 flex-col lg:flex-row">
      <aside className="border-b border-line bg-white px-4 pb-3 pt-4 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-60 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
        <div className="flex items-center justify-between lg:mb-8 lg:px-2">
          <Logo />
          <form action={logout} className="lg:hidden">
            <button className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm text-muted hover:bg-stone-100" type="submit">
              <LogoutIcon width={18} height={18} /> Sign out
            </button>
          </form>
        </div>
        <div className="mt-3 lg:mt-0">
          <AdminNav />
        </div>
        <div className="mt-auto hidden space-y-1 border-t border-line pt-4 lg:block">
          <p className="truncate px-3 text-xs text-muted" title={admin.email}>
            {admin.email}
          </p>
          <Link href="/" className="flex h-10 items-center rounded-xl px-3 text-sm text-muted hover:bg-stone-100 hover:text-ink">
            View site ↗
          </Link>
          <form action={logout}>
            <button type="submit" className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted hover:bg-stone-100 hover:text-ink">
              <LogoutIcon width={18} height={18} /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
