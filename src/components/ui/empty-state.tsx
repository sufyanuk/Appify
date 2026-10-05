import type { ReactNode } from "react";

export function EmptyState({
  emoji = "🍽️",
  title,
  text,
  action,
}: {
  emoji?: string;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-white/60 px-6 py-14 text-center">
      <span className="text-4xl" aria-hidden="true">{emoji}</span>
      <h2 className="mt-3 text-lg font-semibold">{title}</h2>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
