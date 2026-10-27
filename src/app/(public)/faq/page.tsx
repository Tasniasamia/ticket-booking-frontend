import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { T } from "@/components/shared/t";
import {FAQS } from "@/lib/mock-data";
import { Suspense } from "react";
import { getLanguageCookie } from "@/lib/preferences";
import { getPageContent } from "@/features/settings/server";
import { PageContent } from "@/features/settings/types";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";

export const metadata: Metadata = { title: "FAQ | TicketBooking" };

export async function FaqContent({ content }: { content?: PageContent }) {
const [langRes, saved] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  return (
    <>
      <PageHero content={content} lang={lang}/>

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
            <T k="Still need help?" /> <Link href="/contact" className="font-semibold text-coral hover:underline"><T k="Contact us" /></Link>
          </p>
        </div>
      </Section>
    </>
  );
}



export default async function FaqPage() {
  const content = await getPageContent("faq");

  return (
      <Suspense
          fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}
        > 
            <FaqContent content={content} />

        </Suspense>
  )
  
}
