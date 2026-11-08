"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * নির্দিষ্ট সময় পরপর server data আবার আনে (router.refresh)।
 * Tab লুকানো থাকলে refresh করে না, তাই অকারণে server আর network এর কাজ বাড়ে না।
 */
export function AutoRefresh({ intervalMs = 20000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
