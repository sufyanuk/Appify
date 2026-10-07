import type { Metadata } from "next";
import Link from "next/link";
import { deleteFoodItem } from "@/actions/admin-food";
import { AdminHeader } from "@/components/admin/admin-header";
import { AvailabilityToggle } from "@/components/admin/availability-toggle";
import { DeleteButton } from "@/components/admin/delete-button";
import { NoticeToast } from "@/components/admin/notice-toast";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FoodImage } from "@/components/ui/food-image";
import { PencilIcon, PlusIcon } from "@/components/ui/icons";
import { requireAdmin } from "@/lib/auth/session";
import { getAllFoodItems } from "@/lib/data/food";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Food items" };

const notices = { created: "Food item added.", updated: "Changes saved." };

export default async function AdminFoodPage() {
  await requireAdmin();
  const items = await getAllFoodItems();

  return (
    <>
      <NoticeToast messages={notices} />
      <AdminHeader
        title="Food items"
        description="Add, edit or remove items. Unavailable items are hidden from customers."
        action={
          <ButtonLink href="/admin/food/new">
            <PlusIcon width={18} height={18} /> Add food item
          </ButtonLink>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          title="No food items yet"
          text="Add your first item to start taking orders."
          action={<ButtonLink href="/admin/food/new">Add food item</ButtonLink>}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line/60">
          <table className="w-full text-sm">
            <thead className="hidden border-b border-line bg-stone-50/60 text-left text-xs font-medium uppercase tracking-wide text-muted md:table-header-group">
              <tr>
                <th className="px-5 py-3">Item</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3 text-right">Price</th>
                <th className="px-3 py-3">Availability</th>
                <th className="px-5 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => (
                <tr key={item.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 px-4 py-3 md:table-row md:p-0">
                  <td className="row-span-2 md:px-5 md:py-3">
                    <div className="flex items-center gap-3">
                      <div className="group h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <FoodImage src={item.image} alt="" className="h-full w-full text-2xl transition-transform duration-300 ease-out group-hover:scale-125" />
              </div>
                      <div className="hidden min-w-0 md:block">
                        <p className="font-medium">{item.name}</p>
                        <p className="max-w-xs truncate text-xs text-muted">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="min-w-0 md:px-3 md:py-3">
                    <p className="font-medium md:hidden">{item.name}</p>
                    <span className="hidden md:inline">
                      <Badge>{item.category}</Badge>
                    </span>
                    <p className="text-xs text-muted md:hidden">
                      {item.category} · <span className="font-medium text-ink">{formatPrice(item.priceCents)}</span>
                    </p>
                  </td>
                  <td className="hidden text-right font-medium tabular-nums md:table-cell md:px-3 md:py-3">
                    {formatPrice(item.priceCents)}
                  </td>
                  <td className="col-start-2 md:px-3 md:py-3">
                    <AvailabilityToggle id={item.id} name={item.name} available={item.available} />
                  </td>
                  <td className="col-start-3 row-span-2 row-start-1 md:px-5 md:py-3">
                    <div className="flex flex-col items-center justify-end gap-1 md:flex-row">
                      <Link
                        href={`/admin/food/${item.id}/edit`}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-stone-100 hover:text-ink"
                        aria-label={`Edit ${item.name}`}
                        title="Edit"
                      >
                        <PencilIcon width={18} height={18} />
                      </Link>
                      <DeleteButton
                        action={deleteFoodItem.bind(null, item.id)}
                        itemName={item.name}
                        title="Delete food item?"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-xs text-muted">
        Tip: mark an item <strong>Unavailable</strong> instead of deleting it if it&apos;s only temporarily sold out.
      </p>
    </>
  );
}
