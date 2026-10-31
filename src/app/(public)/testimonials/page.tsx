import type { Metadata } from "next";
import { Suspense } from "react";
import { Quote } from "lucide-react";
import { Pager } from "@/components/common/pagination/pager";
import { parseTableParams } from "@/components/common/table/table-params";
import { PageHero } from "@/components/shared/page-hero2";
import { Section } from "@/components/shared/section";
import { CardPagesSkeleton } from "@/components/skeleton/common-card-skeleton";
import { getLanguagesAction } from "@/features/language/actions";
import type { PageContent } from "@/features/settings/types";
import { getPublicTestimonialsAction } from "@/features/testimonial/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";
import TestimonialCard from "@/components/common/card/testimonialCard";
import { AutoRefresh } from "@/components/shared/auto-refresh";

export const metadata: Metadata = { title: "Testimonials | TicketBooking" };

const PER_PAGE =3;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function TestimonialsContent({

  searchParams,
}: {
  content?: PageContent;
  searchParams: SearchParams;
}) {
  const [raw, langRes, saved] = await Promise.all([
    searchParams,
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const params = parseTableParams(raw, [], PER_PAGE);
  const res = await getPublicTestimonialsAction(params);
  const items = res.testimonials ?? [];

  return (
    <>
      <AutoRefresh/>
      <PageHero title="Testimonials" subtitle="Hear what our customers have to say about their experience with us." />
      <Section className="pt-10 sm:pt-12">
        {!res.success ? (
          <div className="glass rounded-4xl p-12 text-center">
            <p className="text-lg font-semibold">{res.message ?? "Could not load testimonials."}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="glass rounded-4xl p-12 text-center">
            <Quote className="mx-auto size-10 opacity-40" />
            <p className="mt-4 text-lg font-semibold">No testimonials yet</p>
            <p className="mt-2 text-fg/60">Check back soon for customer reviews.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((t, i) => (
                <TestimonialCard t={t} i={i} key={t.id} />
              ))}
            </div>
            {res.meta ? <Pager meta={res.meta} /> : null}
          </>
        )}
      </Section>
    </>
  );
}

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // page settings key: "testimonials" if exists in CMS; otherwise hero may be empty — still OK
  return (
    <Suspense fallback={<CardPagesSkeleton />}>
      <TestimonialsContent  searchParams={searchParams} />
    </Suspense>
  );
}

 