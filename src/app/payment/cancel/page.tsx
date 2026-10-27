import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentOutcome, type PaymentSearchParams } from "@/components/payment/payment-outcome";
import { PaymentSkeleton } from "@/components/payment/payment-skeleton";
import { Section } from "@/components/shared/section";

export const metadata: Metadata = { title: "Payment cancelled | TicketBooking" };

export default function PaymentCancelPage({ searchParams }: { searchParams: PaymentSearchParams }) {
  return (
    <Section className="pt-10 sm:pt-16">
      <Suspense fallback={<PaymentSkeleton />}>
        <PaymentOutcome searchParams={searchParams} expect="cancelled" />
      </Suspense>
    </Section>
  );
}
