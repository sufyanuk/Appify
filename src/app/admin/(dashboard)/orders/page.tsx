import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { DeleteAllOrdersButton } from "@/components/admin/delete-all-orders-button";
import { OrderItemsList } from "@/components/admin/order-row-items";
import { StatusSelect } from "@/components/admin/status-select";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAdmin } from "@/lib/auth/session";
import { cn } from "@/lib/cn";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";
import { getOrders } from "@/lib/data/orders";
import { db } from "@/lib/db";
import { formatDateTime, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Orders" };

const filters: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  ...ORDER_STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] })),
];

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const raw = (await searchParams).status;
  const status = typeof raw === "string" ? raw : "";
  const filter =
    status === "pending" || (ORDER_STATUSES as readonly string[]).includes(status)
      ? (status as OrderStatus | "pending")
      : undefined;
  const [orders, totalOrders] = await Promise.all([getOrders(filter), db.order.count()]);

  return (
    <>
      <AdminHeader
        title="Orders"
        description="Update the status as each order moves through the kitchen."
        action={totalOrders > 0 ? <DeleteAllOrdersButton count={totalOrders} /> : undefined}
      />

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {filters.map((f) => {
          const active = (filter ?? "") === f.value;
          return (
            <Link
              key={f.value || "all"}
              href={f.value ? `/admin/orders?status=${f.value}` : "/admin/orders"}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-9 shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors",
                active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:bg-stone-50",
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <EmptyState emoji="🧾" title="No orders here" text="Orders matching this filter will appear here." />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line/60">
          <table className="w-full text-sm">
            <thead className="hidden border-b border-line bg-stone-50/60 text-left text-xs font-medium uppercase tracking-wide text-muted md:table-header-group">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-3 py-3">Date / time</th>
                <th className="px-3 py-3">Items</th>
                <th className="px-3 py-3 text-right">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id} className="flex flex-col gap-2 px-4 py-4 md:table-row md:p-0">
                  <td className="align-top md:px-5 md:py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tabular-nums">{order.orderNumber}</p>
                        {order.customerName && <p className="text-muted">{order.customerName}</p>}
                        {order.customerPhone && (
                          <a
                            href={`tel:${order.customerPhone.replace(/[^\d+]/g, "")}`}
                            className="text-sm font-medium text-brand-600 hover:underline"
                          >
                            {order.customerPhone}
                          </a>
                        )}
                      </div>
                      <span className="font-semibold tabular-nums md:hidden">{formatPrice(order.totalCents)}</span>
                    </div>
                  </td>
                  <td className="align-top text-xs text-muted md:whitespace-nowrap md:px-3 md:py-4 md:text-sm">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="align-top md:px-3 md:py-4">
                    <OrderItemsList items={order.items} />
                    {order.notes && (
                      <p className="mt-1.5 max-w-xs rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-800">
                        Note: {order.notes}
                      </p>
                    )}
                  </td>
                  <td className="hidden text-right align-top font-semibold tabular-nums md:table-cell md:px-3 md:py-4">
                    {formatPrice(order.totalCents)}
                  </td>
                  <td className="align-top md:px-5 md:py-3">
                    <StatusSelect orderId={order.id} orderNumber={order.orderNumber} status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
