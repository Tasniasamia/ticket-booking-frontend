"use client";

import dayjs from "dayjs";

/**
 * Server আর browser এর timezone আলাদা হলে SSR এর লেখা আর hydrate এর লেখা মেলে না।
 * suppressHydrationWarning দিয়ে browser এর সময়টাই দেখানো হয়।
 */
export function LocalTime({ iso, format = "DD MMM YYYY, hh:mm A" }: { iso: string; format?: string }) {
  if (!iso) return <>—</>;
  const d = dayjs(iso);
  return <span suppressHydrationWarning>{d.isValid() ? d.format(format) : "—"}</span>;
}
