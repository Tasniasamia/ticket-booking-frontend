"use client";

import { useState, useTransition } from "react";
import { resendOtpAction } from "@/features/auth/actions";
import { useCooldown } from "@/features/auth/hooks/use-cooldown";
import type { OtpReason } from "@/features/auth/service";

export function ResendOtpButton({ email, reason }: { email: string; reason: OtpReason }) {
  const [left, restart] = useCooldown(email, reason);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string }>();

  const resend = () =>
    start(async () => {
      const res = await resendOtpAction({ email, reason });
      setMsg({ ok: res.success, text: res.message ?? "" });
      if (res.success) restart();
    });

  const waiting = left > 0;
  const unknown = left < 0; // hydration শেষ হওয়ার আগে বাটন চালু দেখিয়ে ভুল click এড়াতে

  return (
    <div className="text-center text-sm">
      <button type="button" onClick={resend} disabled={waiting || unknown || pending || !email}
        className="cursor-pointerfont-semibold text-coral hover:underline disabled:cursor-not-allowed disabled:text-fg/40 disabled:no-underline">
        {pending ? "Sending..." : waiting ? `Resend code in ${left}s` : "Resend code"}
      </button>
      {msg && <p role="status" className={`mt-2 ${msg.ok ? "text-fg/70" : "text-red-500"}`}>{msg.text}</p>}
    </div>
  );
}
