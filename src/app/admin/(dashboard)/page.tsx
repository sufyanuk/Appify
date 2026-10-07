import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ChartCard, KpiTile, RankedBars } from "@/components/admin/dashboard-charts";
import { CustomersTrend, MonthlyTrend } from "@/components/admin/dashboard-monthly";
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

  const { kpis, months } = stats;
  const last6 = months.slice(-6);
  const monthName = months[11].label;

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
        description="Your kitchen at a glance: monthly sales, orders and customers."
        action={
          <ButtonLink href="/admin/food/new">
            <PlusIcon width={18} height={18} /> Add food item
          </ButtonLink>
        }
      />

      {/* Month-to-date KPIs */}
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          {monthName} · month to date
        </h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/admin/orders?status=pending"
            className={`rounded-full px-3 py-1 font-medium ring-1 ${stats.pendingOrders > 0 ? "bg-brand-50 text-brand-700 ring-brand-200" : "bg-white text-muted ring-line"}`}
          >
            {stats.pendingOrders} pending order{stats.pendingOrders === 1 ? "" : "s"}
          </Link>
          <Link href="/admin/food" className="rounded-full bg-white px-3 py-1 font-medium text-muted ring-1 ring-line">
            {stats.availableItems}/{stats.totalItems} dishes available
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <KpiTile
          label="Revenue"
          value={formatPrice(kpis.revenue.current)}
          current={kpis.revenue.current}
          previous={kpis.revenue.previous}
          trend={last6.map((m) => m.revenueCents)}
        />
        <KpiTile
          label="Orders"
          value={String(kpis.orders.current)}
          current={kpis.orders.current}
          previous={kpis.orders.previous}
          trend={last6.map((m) => m.orders)}
          href="/admin/orders"
        />
        <KpiTile
          label="Customers"
          value={String(kpis.customers.current)}
          current={kpis.customers.current}
          previous={kpis.customers.previous}
          trend={last6.map((m) => m.customers)}
        />
        <KpiTile
          label="Average order"
          value={formatPrice(kpis.avgOrder.current)}
          current={kpis.avgOrder.current}
          previous={kpis.avgOrder.previous}
          trend={last6.map((m) => m.avgOrderCents)}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3 lg:gap-6">
        <ChartCard
          className="lg:col-span-3"
          title="Monthly performance"
          subtitle="Excludes cancelled orders · current month is month to date (dashed) · hover, tap or use ← → for details"
        >
          <MonthlyTrend months={months} />
        </ChartCard>
        <ChartCard
          className="lg:col-span-2"
          title="Customers per month"
          subtitle={`New vs returning · ${stats.totalCustomers} customers in total · current month is month to date`}
        >
          <CustomersTrend months={months} />
        </ChartCard>
        <ChartCard title="Top dishes" subtitle="Quantity sold · last 90 days">
          <RankedBars
            rows={stats.topItems}
            formatValue={(v) => `${v} sold`}
            formatSecondary={(v) => formatPrice(v)}
            emptyText="No dishes sold in the last 90 days."
          />
        </ChartCard>
        <ChartCard className="lg:col-span-3" title="Sales by category" subtitle="Revenue · last 90 days">
          <RankedBars
            rows={stats.categorySales}
            formatValue={(v) => formatPrice(v)}
            formatSecondary={(v) => `${v} items`}
            emptyText="No sales in the last 90 days."
          />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_280px]">
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
