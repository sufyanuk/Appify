"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toaster";

/** Shows a one-off toast for ?notice=… after a redirect, then cleans the URL. */
export function NoticeToast({ messages }: { messages: Record<string, string> }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const shown = useRef<string | null>(null);
  const notice = params.get("notice");

  useEffect(() => {
    if (!notice || shown.current === notice) return;
    shown.current = notice;
    if (messages[notice]) toast(messages[notice]);
    router.replace(pathname, { scroll: false });
  }, [notice, messages, toast, router, pathname]);

  return null;
}
