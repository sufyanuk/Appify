import type { Metadata } from "next";
import { OrderMenu } from "@/components/order/order-menu";
import { PageHeader } from "@/components/site/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getAvailableFoodItems } from "@/lib/data/food";
import { cleanWhatsAppNumber } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Order food" };

export default async function OrderPage() {
  const items = await getAvailableFoodItems();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="Menu"
        title="Order homemade food"
        description="Freshly cooked at home every day. Choose your dishes and quantities, then submit your order."
      />
      <p className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
        <strong className="font-semibold">Please order at least 3 days in advance.</strong>{" "}
        Pick-up &amp; drop-off available (charges apply).
      </p>
      <div className="mt-6 sm:mt-8">
        {items.length === 0 ? (
          <EmptyState
            title="The menu is empty right now"
            text="Please check back a little later."
          />
        ) : (
          <OrderMenu items={items} whatsAppNumber={cleanWhatsAppNumber(process.env.WHATSAPP_NUMBER)} />
        )}
      </div>
    </div>
  );
}
