"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

// TODO: Book tickets এ Server Action (features/bookings/actions.ts) যুক্ত করো, তারপর Stripe URL এ redirect।
export function BookingPanel({ price }: { price: number }) {
  const [qty, setQty] = useState(1);
  const step = "glass grid size-10 place-items-center rounded-full hover:bg-fg/10 disabled:opacity-40";
  return (
    <aside className="glass sticky top-28 rounded-4xl p-6">
      <p className="text-sm text-fg/60">Price per ticket</p>
      <p className="text-grad text-4xl font-extrabold">${price}</p>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-medium">Tickets</span>
        <div className="flex items-center gap-3">
          <button className={step} aria-label="Fewer tickets" disabled={qty <= 1} onClick={() => setQty(qty - 1)}><Minus className="size-4" /></button>
          <span className="w-6 text-center font-bold" aria-live="polite">{qty}</span>
          <button className={step} aria-label="More tickets" disabled={qty >= 10} onClick={() => setQty(qty + 1)}><Plus className="size-4" /></button>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-fg/15 pt-5">
        <span className="text-fg/65">Total</span><span className="text-xl font-bold">${price * qty}</span>
      </div>
      <button className="btn-grad mt-6 w-full rounded-full py-3.5 font-semibold">Book tickets</button>
    </aside>
  );
}
