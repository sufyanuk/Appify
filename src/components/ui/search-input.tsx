"use client";

import { SearchIcon, XIcon } from "./icons";
import { cn } from "@/lib/cn";

/** Rounded search box with a clear (×) button. Filtering happens as you type. */
export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  className?: string;
}) {
  return (
    <div role="search" className={cn("relative", className)}>
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && value && onChange("")}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        enterKeyHint="search"
        maxLength={60}
        className="block h-12 w-full rounded-full border border-line bg-white pl-11 pr-12 text-[15px] text-ink shadow-card placeholder:text-stone-400 transition-colors focus:border-ink focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-stone-100 hover:text-ink"
        >
          <XIcon width={18} height={18} />
        </button>
      )}
    </div>
  );
}
