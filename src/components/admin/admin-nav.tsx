"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  BookIcon,
  GridIcon,
  ReceiptIcon,
  SettingsIcon,
  UtensilsIcon,
} from "@/components/ui/icons";

const links = [
  { href: "/admin", label: "Dashboard", icon: GridIcon, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ReceiptIcon },
  { href: "/admin/food", label: "Food items", icon: UtensilsIcon },
  { href: "/admin/recipes", label: "Recipes", icon: BookIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
              active ? "bg-ink text-white" : "text-muted hover:bg-stone-100 hover:text-ink",
            )}
          >
            <Icon width={18} height={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
