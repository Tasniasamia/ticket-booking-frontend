"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// .env.local: NEXT_PUBLIC_LIVE_WS_URL=ws://localhost:1323/api/v1/live/events
const WS_URL = process.env.NEXT_PUBLIC_LIVE_WS_URL;
const DEBOUNCE_MS = 300; // একসাথে কয়েকটা বার্তা এলে একবারই refresh
const MAX_BACKOFF_MS = 30_000;

type Timer = ReturnType<typeof setTimeout>;


export function LiveRefresh({ eventId }: { eventId?: number }) {
  const router = useRouter();

  useEffect(() => {
    if (!WS_URL) return;

    let ws: WebSocket | null = null;
    let closed = false;
    let retry = 0;
    let reconnectTimer: Timer | undefined;
    let refreshTimer: Timer | undefined;

    const refresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => router.refresh(), DEBOUNCE_MS);
    };

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        // connection কেটে আবার জোড়া লাগলে মাঝের বার্তা মিস হয়ে থাকতে পারে, তাই একবার refresh
        if (retry > 0) refresh();
        retry = 0;
      };

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data as string) as { type?: string; event_id?: number };
          if (msg.type !== "tickets_changed") return;
          if (eventId && msg.event_id !== eventId) return;
          refresh();
        } catch {
          /* ভুল বার্তা উপেক্ষা */
        }
      };

      ws.onclose = () => {
        if (closed) return;
        const delay = Math.min(1000 * 2 ** retry, MAX_BACKOFF_MS);
        retry += 1;
        reconnectTimer = setTimeout(connect, delay);
      };

      ws.onerror = () => ws?.close();
    };

    // phone এ tab ব্যাকগ্রাউন্ডে গেলে connection মরে যেতে পারে, ফিরে এলে একবার refresh
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    connect();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      closed = true;
      clearTimeout(reconnectTimer);
      clearTimeout(refreshTimer);
      document.removeEventListener("visibilitychange", onVisible);
      ws?.close();
    };
  }, [router, eventId]);

  return null;
}
