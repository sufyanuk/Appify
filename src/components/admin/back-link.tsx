import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon } from "@/components/ui/icons";

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="mb-3 inline-flex items-center gap-1.5 py-1 text-sm font-medium text-muted hover:text-ink"
    >
      <ArrowLeftIcon width={16} height={16} /> {children}
    </Link>
  );
}
