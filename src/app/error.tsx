"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <span className="text-5xl" aria-hidden="true">😕</span>
      <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-muted">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      <Button onClick={retry} className="mt-6">
        Try again
      </Button>
    </main>
  );
}
