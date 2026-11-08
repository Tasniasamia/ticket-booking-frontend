import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { T } from "@/components/shared/t";
import { Suspense } from "react";
import { getLanguageCookie } from "@/lib/preferences";
import { getPageContent } from "@/features/settings/server";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { Bone } from "@/components/skeleton/sections";
import { getPublicFAQsAction } from "@/features/faq/actions";
import { AutoRefresh } from "@/components/shared/auto-refresh";

export const metadata: Metadata = { title: "FAQ | TicketBooking" };

function FaqListSkeleton() {
  const widths = ["w-48", "w-64", "w-40", "w-60", "w-72", "w-64"];
  return (
    <Section className="pt-10 sm:pt-12">
      <div className="mx-auto max-w-3xl space-y-4">
        {widths.map((w, i) => (
          <div
            key={i}
            className="flex h-14 items-center justify-between rounded-3xl border border-fg/10 bg-fg/5 px-6 py-5"
          >
            <Bone className={`h-4 ${w} max-w-[75%]`} />
            <Bone className="size-5 rounded-full" />
          </div>
        ))}
        <div className="flex justify-center pt-6 pb-10">
          <Bone className="h-4 w-52" />
        </div>
      </div>
    </Section>
  );
}

async function FaqList() {
  const faqRes = await getPublicFAQsAction(50);
  const faqs = faqRes.faqs ?? [];

  return (
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
              <p className="mt-3 leading-relaxed text-fg/70 whitespace-pre-wrap">
                <T k={f.answer} />
              </p>
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
  );
}

export default async function FaqPage() {
  const [content, langRes, saved] = await Promise.all([
    getPageContent("faq"),
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  return (
    <>
      <AutoRefresh />
      <PageHero content={content} lang={lang} />
      <Suspense fallback={<FaqListSkeleton />}>
        <FaqList />
      </Suspense>
    </>
  );
}
