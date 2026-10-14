import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { FAQS } from "@/lib/mock-data";

export const metadata: Metadata = { title: "FAQ | TicketBooking" };

export default function FaqPage() {
  return (
    <>
      <PageHero title="Frequently asked questions" subtitle="Quick answers about booking, payments and your account." />
      <Section className="pt-10 sm:pt-12">
        <div className="mx-auto max-w-3xl space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="glass group rounded-3xl px-6 py-5 open:bg-fg/5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-coral [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="size-5 shrink-0 text-coral transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 leading-relaxed text-fg/70">{f.a}</p>
            </details>
          ))}
          <p className="pt-6 text-center text-fg/65">
            Still need help? <Link href="/contact" className="font-semibold text-coral hover:underline">Contact us</Link>
          </p>
        </div>
      </Section>
    </>
  );
}
