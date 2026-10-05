import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage({ searchParams }: PageProps<"/admin/settings">) {
  const admin = await requireAdmin();
  const usingDefaultPassword = (await searchParams).notice === "default-password";

  return (
    <>
      <AdminHeader title="Settings" description="Manage your admin account." />
      <div className="grid max-w-2xl gap-6">
        {usingDefaultPassword && (
          <div role="alert" className="rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-900 ring-1 ring-amber-200">
            <p className="font-semibold">You&apos;re using the example password.</p>
            <p className="mt-1">Anyone who has read the setup guide knows it. Please choose a new password below.</p>
          </div>
        )}
        <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line/60 sm:p-8">
          <h2 className="font-semibold">Account</h2>
          <dl className="mt-4 grid gap-1 text-sm">
            <dt className="text-muted">Signed in as</dt>
            <dd className="font-medium">{admin.email}</dd>
          </dl>
          <p className="mt-4 text-xs text-muted">
            To add another admin or reset a forgotten password, run{" "}
            <code className="rounded bg-stone-100 px-1.5 py-0.5">npm run admin:create -- email &quot;password&quot;</code>{" "}
            on the server.
          </p>
        </section>
        <section className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line/60 sm:p-8">
          <h2 className="font-semibold">Change password</h2>
          <p className="mt-1 text-sm text-muted">Changing your password signs out all other sessions.</p>
          <div className="mt-5">
            <ChangePasswordForm />
          </div>
        </section>
      </div>
    </>
  );
}
