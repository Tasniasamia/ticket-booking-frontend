"use client";

import { cn } from "@/lib/utils";
import { usePreferences } from "@/providers/preferences-provider";

/**
 * দাম দেখানোর একটাই জায়গা। `from` = দামটা যে currency তে আছে (না দিলে BDT)। Server Component এর ভেতরেও বসানো যায়।
 * Currency list আসা পর্যন্ত দাম লুকিয়ে জায়গা ধরে রাখি, যাতে ভুল currency এর দাম এক মুহূর্তের জন্যও না ঝলকায়।
 * Backend বন্ধ থাকলে (status = error) মূল currency তেই দাম দেখাই।
 */
export function Price({ amount, from, className }: { amount: number; from?: string; className?: string }) {
  const { formatPrice, status } = usePreferences();
  return (
    <span className={className}>
      <span className={cn("transition-opacity duration-200", status === "loading" ? "opacity-0" : "opacity-100")}>
        {formatPrice(amount, from)}
      </span>
    </span>
  );
}
