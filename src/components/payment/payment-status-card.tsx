"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ban, CheckCheck, CircleCheck, CircleX, Clock3, Copy, RefreshCw, type LucideIcon } from "lucide-react";
import { toast } from "react-toastify";
import { LocalTime } from "@/components/dashboard/events/local-time";
import { formatFallback } from "@/features/currency/utils";
import type { PaymentSummary } from "@/features/payment/types";
import { textOf } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { usePreferences, useT } from "@/providers/preferences-provider";

export type PaymentVariant = "success" | "pending" | "failed" | "cancelled" | "error";

type Look = { icon: LucideIcon; tone: string; title: string; text: string };

// দুই theme এই ঠিক দেখায়: রঙ শুধু /15 /30 opacity এর tint
const LOOK: Record<PaymentVariant, Look> = {
  success: {
    icon: CircleCheck,
    tone: "bg-emerald-500/15 text-emerald-500 ring-emerald-500/30",
    title: "Payment successful",
    text: "Your booking is confirmed. Show the booking code below at the gate.",
  },
  pending: {
    icon: Clock3,
    tone: "bg-ice/15 text-ice ring-ice/30",
    title: "Confirming your payment",
    text: "We have not received the confirmation yet. This usually takes a few seconds.",
  },
  failed: {
    icon: CircleX,
    tone: "bg-red-500/15 text-red-500 ring-red-500/30",
    title: "Payment failed",
    text: "We could not complete your payment, and you have not been charged. Please try again.",
  },
  cancelled: {
    icon: Ban,
    tone: "bg-coral/15 text-coral ring-coral/30",
    title: "Payment cancelled",
    text: "You cancelled the payment. No money was taken. You can book again whenever you are ready.",
  },
  error: {
    icon: CircleX,
    tone: "bg-red-500/15 text-red-500 ring-red-500/30",
    title: "We could not check your payment",
    text: "Something went wrong while confirming it. If money was taken, it will show in your bookings soon.",
  },
};

const secondary = "glass cursor-pointer rounded-full px-6 py-3 text-center text-sm font-semibold transition hover:bg-fg/10";
const primary = "btn-grad cursor-pointer rounded-full px-6 py-3 text-center text-sm font-semibold";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <dt className="text-sm text-fg/60">{label}</dt>
      <dd className="min-w-0 break-words text-right text-sm font-semibold">{children}</dd>
    </div>
  );
}

function BookingCode({ code }: { code: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error(t("Could not copy. Please copy it manually."));
    }
  };
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-fg/25 bg-fg/5 p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-fg/55">{t("Booking code")}</p>
      <p className="text-grad mt-2 break-all font-mono text-xl font-extrabold sm:text-2xl">{code}</p>
      <button type="button" onClick={copy} className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-coral hover:underline">
        {copied ? <CheckCheck className="size-4" /> : <Copy className="size-4" />}
        {copied ? t("Copied") : t("Copy code")}
      </button>
    </div>
  );
}

/**
 * success / failed / cancel / pending সব result page এর একটাই card।
 * variant ঠিক করে server (PaymentOutcome), এখানে শুধু দেখানো।
 */
export function PaymentStatusCard({ variant, payment, message, lang }: { variant: PaymentVariant; payment?: PaymentSummary; message?: string; lang: string }) {
  const t = useT();
  const router = useRouter();
  const { language } = usePreferences();
  const look = LOOK[variant];
  const Icon = look.icon;
  const showReceipt = payment && (variant === "success" || variant === "pending");

  return (
    <div className="glass mx-auto w-full max-w-xl rounded-4xl p-6 sm:p-10">
      <div className="text-center">
        <span className={cn("mx-auto grid size-20 place-items-center rounded-full ring-8", look.tone)}>
          <Icon className="size-10" strokeWidth={1.75} />
        </span>
        <h1 className={cn("mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl", variant === "success" && "text-grad")}>{t(look.title)}</h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-fg/65">{variant === "error" && message ? message : t(look.text)}</p>
      </div>

      {variant === "success" && payment?.bookingCode && <BookingCode code={payment.bookingCode} />}

      {showReceipt && payment && (
        <dl className="mt-8 divide-y divide-fg/10 border-t border-fg/10">
          {payment.event && <Row label={t("Event")}>{textOf(payment.event.title, lang)}</Row>}
          {payment.event?.startsAt && <Row label={t("Date")}><LocalTime iso={payment.event.startsAt} /></Row>}
          {payment.event && <Row label={t("Location")}>{textOf(payment.event.location, lang)}</Row>}
          {payment.quantity > 0 && <Row label={t("Tickets")}>{payment.quantity}</Row>}
          <Row label={t("Amount paid")}>{formatFallback(payment.amount, payment.currency, language)}</Row>
          {payment.method && <Row label={t("Payment method")}><span className="capitalize">{payment.method}</span></Row>}
          {payment.transactionId && <Row label={t("Transaction ID")}><span className="font-mono text-xs">{payment.transactionId}</span></Row>}
        </dl>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {variant === "success" && (
          <>
            <Link href="/user" className={primary}>{t("Go to my dashboard")}</Link>
            <Link href="/events" className={secondary}>{t("Browse more events")}</Link>
          </>
        )}
        {variant === "pending" && (
          <>
            <button type="button" onClick={() => router.refresh()} className={cn(primary, "inline-flex items-center justify-center gap-2")}>
              <RefreshCw className="size-4" />{t("Check again")}
            </button>
            <Link href="/user" className={secondary}>{t("Go to my dashboard")}</Link>
          </>
        )}
        {(variant === "failed" || variant === "cancelled" || variant === "error") && (
          <>
            <Link href="/events" className={primary}>{t("Back to events")}</Link>
            <Link href="/contact" className={secondary}>{t("Contact support")}</Link>
          </>
        )}
      </div>
    </div>
  );
}
