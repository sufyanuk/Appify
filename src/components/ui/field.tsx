import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "block w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink placeholder:text-stone-400 transition-colors focus:border-ink focus:outline-none focus:ring-0 aria-[invalid=true]:border-red-500";

export function Field({
  label,
  htmlFor,
  hint,
  errors,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  errors?: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {errors?.length ? (
        <p id={`${htmlFor}-error`} className="text-sm text-red-600">
          {errors[0]}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "py-2.5 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(control, "h-11 pr-8", className)} {...props} />;
}

/** Convenience: aria props that link a control to its error message. */
export function errorProps(name: string, errors?: string[]) {
  return errors?.length
    ? { "aria-invalid": true, "aria-describedby": `${name}-error` }
    : {};
}

export function FormMessage({ message, tone = "error" }: { message?: string; tone?: "error" | "success" }) {
  if (!message) return null;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl px-4 py-3 text-sm",
        tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700",
      )}
    >
      {message}
    </div>
  );
}
