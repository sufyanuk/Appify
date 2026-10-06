import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { getOrderByPublicId } from "@/lib/data/orders";
import { formatDateTime, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function ConfirmationPage({
  params,
}: PageProps<"/order/confirmation/[publicId]">) {
  const order = await getOrderByPublicId((await params).publicId);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckIcon width={32} height={32} strokeWidth={2.2} />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
          Order successfully submitted!
        </h1>
        <p className="mt-2 text-muted">
          Thanks{order.customerName ? `, ${order.customerName}` : ""}! We&apos;ve received your order.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-line/60">
        <div className="flex items-center justify-between gap-4 border-b border-line bg-stone-50/60 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Order</p>
            <p className="text-xl font-semibold tabular-nums">#{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">Status</p>
            <StatusBadge status={order.status} />
          </div>
        </div>

        <table className="w-full text-[15px]">
          <thead className="sr-only">
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted tabular-nums">{formatPrice(item.unitPriceCents)} each</p>
                </td>
                <td className="px-2 py-3 text-right text-muted tabular-nums">× {item.quantity}</td>
                <td className="px-5 py-3 text-right font-medium tabular-nums">
                  {formatPrice(item.lineTotalCents)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-line">
              <td className="px-5 py-4 font-semibold" colSpan={2}>
                Total
              </td>
              <td className="px-5 py-4 text-right text-xl font-semibold tabular-nums">
                {formatPrice(order.totalCents)}
              </td>
            </tr>
          </tfoot>
        </table>

        {order.notes && (
          <div className="border-t border-line px-5 py-4 text-sm">
            <p className="font-medium">Notes</p>
            <p className="mt-1 whitespace-pre-line text-muted">{order.notes}</p>
          </div>
        )}
        <p className="border-t border-line px-5 py-3 text-xs text-muted">
          Placed {formatDateTime(order.createdAt)} · Pay on delivery or collection
        </p>
      </div>

      <p className="mt-4 text-center text-sm text-muted">
        Bookmark this page to check your order status.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href="/order" variant="secondary">
          Place another order
        </ButtonLink>
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </div>
  );
}
