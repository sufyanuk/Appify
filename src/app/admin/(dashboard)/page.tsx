import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { OrderItemsList } from "@/components/admin/order-row-items";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ArrowRightIcon,
  BookIcon,
  PlusIcon,
  ReceiptIcon,
  SettingsIcon,
  UtensilsIcon,
} from "@/components/ui/icons";
import { requireAdmin } from "@/lib/auth/session";
import { getDashboardStats } from "@/lib/data/orders";
import { formatDateTime, formatPrice } from "@/lib/format";

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total orders", value: stats.totalOrders, href: "/admin/orders" },
    { label: "Pending orders", value: stats.pendingOrders, href: "/admin/orders?status=pending", highlight: stats.pendingOrders > 0 },
    { label: "Available food items", value: `${stats.availableItems} / ${stats.totalItems}`, href: "/admin/food" },
    { label: "Revenue (excl. cancelled)", value: formatPrice(stats.revenueCents), href: "/admin/orders" },
  ];

  const quickLinks = [
    { href: "/admin/food/new", label: "Add food item", icon: PlusIcon },
    { href: "/admin/food", label: "Food items", icon: UtensilsIcon },
    { href: "/admin/orders", label: "Orders", icon: ReceiptIcon },
    { href: "/admin/recipes", label: "Recipes", icon: BookIcon },
    { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <>
      <AdminHeader
        title={`Welcome back${admin.name && admin.name !== "Admin" ? `, ${admin.name}` : ""}`}
        description="Here's what's happening today."
        action={
          <ButtonLink href="/admin/food/new">
            <PlusIcon width={18} height={18} /> Add food item
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line/60 transition hover:ring-ink/20 sm:p-5"
          >
            <p className="text-xs font-medium text-muted sm:text-sm">{c.label}</p>
            <p className={`mt-2 text-2xl font-semibold tabular-nums sm:text-3xl ${c.highlight ? "text-brand-600" : ""}`}>
              {c.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_280px]">
        <section className="rounded-2xl bg-white shadow-card ring-1 ring-line/60">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
              View all <ArrowRightIcon width={16} height={16} />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <div className="p-5">
              <EmptyState emoji="🧾" title="No orders yet" text="New orders will show up here." />
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {stats.recentOrders.map((order) => (
                <li key={order.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold tabular-nums">
                      {order.orderNumber}
                      {order.customerName && <span className="font-normal text-muted"> · {order.customerName}</span>}
                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone.replace(/[^\d+]/g, "")}`}
                          className="ml-1 text-sm font-normal text-brand-600 hover:underline"
                        >
                          {order.customerPhone}
                        </a>
                      )}
                    </p>
                    <p className="mb-1.5 text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                    <OrderItemsList items={order.items} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={order.status} />
                    <span className="font-semibold tabular-nums">{formatPrice(order.totalCents)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-white p-3 shadow-card ring-1 ring-line/60 xl:self-start">
          <h2 className="px-2 pb-2 pt-1 font-semibold">Quick access</h2>
          <ul>
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="flex h-11 items-center gap-3 rounded-xl px-2 text-sm font-medium hover:bg-stone-100">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon width={16} height={16} />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
