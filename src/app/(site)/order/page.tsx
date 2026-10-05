import type { Metadata } from "next";
import { OrderMenu } from "@/components/order/order-menu";
import { PageHeader } from "@/components/site/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getAvailableFoodItems } from "@/lib/data/food";

export const metadata: Metadata = { title: "Order food" };

export default async function OrderPage() {
  const items = await getAvailableFoodItems();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        eyebrow="Menu"
        title="Order food"
        description="Choose your items and quantities, then submit your order."
      />
      <div className="mt-6 sm:mt-8">
        {items.length === 0 ? (
          <EmptyState
            title="The menu is empty right now"
            text="Please check back a little later."
          />
        ) : (
          <OrderMenu items={items} />
        )}
      </div>
    </div>
  );
}
