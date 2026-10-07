import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";

const tones = {
  neutral: "bg-stone-100 text-stone-700",
  brand: "bg-brand-50 text-brand-700",
  blue: "bg-sky-50 text-sky-700",
  amber: "bg-amber-50 text-amber-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusTone: Record<OrderStatus, keyof typeof tones> = {
  RECEIVED: "blue",
  PREPARING: "amber",
  READY: "brand",
  COMPLETED: "green",
  CANCELLED: "red",
};

export function StatusBadge({ status }: { status: string }) {
  const s = status as OrderStatus;
  return <Badge tone={statusTone[s] ?? "neutral"}>{ORDER_STATUS_LABELS[s] ?? status}</Badge>;
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const tone = difficulty === "Easy" ? "green" : difficulty === "Medium" ? "amber" : "red";
  return <Badge tone={tone}>{difficulty}</Badge>;
}
