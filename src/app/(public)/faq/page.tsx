import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { T } from "@/components/shared/t";
import { Suspense } from "react";
import { getLanguageCookie } from "@/lib/preferences";
import { getPageContent } from "@/features/settings/server";
import type { PageContent } from "@/features/settings/types";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { FaqSkeleton } from "@/components/skeleton/faq-skeleton";
import { getPublicFAQsAction } from "@/features/faq/actions";
import { AutoRefresh } from "@/components/shared/auto-refresh";

export const metadata: Metadata = { title: "FAQ | TicketBooking" };

export async function FaqContent({ content }: { content?: PageContent }) {
  const [langRes, saved, faqRes] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
    getPublicFAQsAction(50),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const faqs = faqRes.faqs ?? [];

  return (
    <>
      <AutoRefresh/>
      <PageHero content={content} lang={lang} />
      <Section className="pt-10 sm:pt-12">
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.length === 0 ? (
            <p className="text-center text-fg/60">No FAQs yet.</p>
          ) : (
            faqs.map((f) => (
              <details key={f.id} className="glass group rounded-3xl px-6 py-5 open:bg-fg/5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-coral [&::-webkit-details-marker]:hidden">
                 <T k={f.question} />
                  <ChevronDown className="size-5 shrink-0 text-coral transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-fg/70 whitespace-pre-wrap"> <T k={f.answer} /></p>
              </details>
            ))
          )}
          <p className="pt-6 text-center text-fg/65">
            <T k="Still need help?" />{" "}
            <Link href="/contact" className="font-semibold text-coral hover:underline">
              <T k="Contact us" />
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}

export default async function FaqPage() {
  const content = await getPageContent("faq");
  return (
    <Suspense fallback={<FaqSkeleton />}>
      <FaqContent content={content} />
    </Suspense>
  );
}
