
import { Section, SectionHeading } from "@/components/shared/section";

import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import { getPublicFAQsAction } from "@/features/faq/actions";
import { ChevronDown } from "lucide-react";
import { T } from "../shared/t";
// import Link from "next/link";

export async function Faq() {
  const [langRes, saved, faqRes] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
    getPublicFAQsAction(4),
  ]);
  const faqs = faqRes.faqs ?? [];


  return (
    <Section id="faq">
      <SectionHeading title={"Frequently Asked Questions"} subtitle={"Find answers to common questions about our services"}   href="/faq"
        hrefLabel={<T k="View all" />}/>
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
          {/* <p className="pt-6 text-center text-fg/65">
            <T k="Still need help?" />{" "}
            <Link href="/contact" className="font-semibold text-coral hover:underline">
              <T k="Contact us" />
            </Link>
          </p> */}
        </div>
    </Section>
  );
}
