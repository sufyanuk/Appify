"use client";

/* eslint-disable @next/next/no-img-element -- admin-provided images can come from any host */
import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Image with a calm placeholder when the URL is empty or fails to load, so a
 * broken link never shows a broken-image icon to customers.
 */
export function FoodImage({
  src,
  alt,
  className,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showFallback = !src || failedSrc === src;

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-brand-50 to-stone-100 text-4xl",
          className,
        )}
      >
        <span aria-hidden="true">🍽️</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={cn("bg-stone-100 object-cover", className)}
    />
  );
}
