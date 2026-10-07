import type { OrderWithItems } from "@/lib/data/orders";

export function OrderItemsList({ items }: { items: OrderWithItems["items"] }) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item.id} className="text-sm">
          <span className="font-medium tabular-nums">{item.quantity}×</span> {item.name}
        </li>
      ))}
    </ul>
  );
}
