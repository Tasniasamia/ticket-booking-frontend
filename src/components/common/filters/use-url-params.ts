"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * List page এর state (page, search, filter) URL এই থাকে, DataTable এর মতোই।
 * refresh / back / share link সব কাজ করে আর Server Component সেই URL থেকেই backend ডাকে।
 * filter বদলালে page নিজে থেকেই 1 এ ফেরে (patch এ page না থাকলে)।
 */
export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const update = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const q = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === "") q.delete(k);
        else q.set(k, String(v));
      }
      if (!("page" in patch)) q.delete("page");
      const qs = q.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, sp],
  );

  return { sp, update };
}
