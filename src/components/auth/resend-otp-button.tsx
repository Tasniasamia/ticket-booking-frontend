"use client";

import { useState, useTransition } from "react";
import { resendOtpAction } from "@/features/auth/actions";
import { useCooldown } from "@/features/auth/hooks/use-cooldown";
import type { OtpReason } from "@/features/auth/service";

export function ResendOtpButton({ email, reason, initialCooldown = 30 }: { email: string; reason: OtpReason; initialCooldown?: number }) {
  const [left, setLeft] = useCooldown(initialCooldown);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string }>();

  const resend = () =>
    start(async () => {
      const res = await resendOtpAction({ email, reason });
      setMsg({ ok: res.success, text: res.message ?? "" });
      if (res.success) setLeft(60);
    });

  return (
    <div className="text-center text-sm">
      <button type="button" onClick={resend} disabled={left > 0 || pending || !email}
        className="font-semibold text-coral hover:underline disabled:cursor-not-allowed disabled:text-fg/40 disabled:no-underline">
        {pending ? "Sending..." : left > 0 ? `Resend code in ${left}s` : "Resend code"}
      </button>
      {msg && <p role="status" className={`mt-2 ${msg.ok ? "text-fg/70" : "text-red-500"}`}>{msg.text}</p>}
    </div>
  );
}
