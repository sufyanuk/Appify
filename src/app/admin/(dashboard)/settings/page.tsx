import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-header";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const admin = await requireAdmin();

  return (
    <>
      <AdminHeader title="Settings" description="Manage your admin account." />
      <div className="grid max-w-2xl gap-6">
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
