"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { MOCK_PRICE_CURRENCY } from "@/lib/constants";
import { Price } from "@/components/shared/price";
import { useT } from "@/providers/preferences-provider";

// TODO: Book tickets এ Server Action (features/bookings/actions.ts) যুক্ত করো, তারপর Stripe URL এ redirect।
export function BookingPanel({ price }: { price: number }) {
  const [qty, setQty] = useState(1);
  const t = useT();
  const step = " cursor-pointer glass grid size-10 place-items-center rounded-full hover:bg-fg/10 disabled:opacity-40";
  return (
    <aside className="glass  rounded-4xl p-6">
      <p className="text-sm text-fg/60">{t("Price per ticket")}</p>
      <p className="text-grad text-4xl font-extrabold"><Price amount={price} from={MOCK_PRICE_CURRENCY} /></p>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-medium">{t("Tickets")}</span>
        <div className="flex items-center gap-3">
          <button className={step} aria-label={t("Fewer tickets")} disabled={qty <= 1} onClick={() => setQty(qty - 1)}><Minus className="size-4" /></button>
          <span className="w-6 text-center font-bold" aria-live="polite">{qty}</span>
          <button className={step} aria-label={t("More tickets")} disabled={qty >= 10} onClick={() => setQty(qty + 1)}><Plus className="size-4" /></button>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-fg/15 pt-5">
        <span className="text-fg/65">{t("Total")}</span><span className="text-xl font-bold"><Price amount={price * qty} from={MOCK_PRICE_CURRENCY} /></span>
      </div>
      <button className="btn-grad mt-6 w-full rounded-full py-3.5 font-semibold cursor-pointer">{t("Book tickets")}</button>
    </aside>
  );
}
