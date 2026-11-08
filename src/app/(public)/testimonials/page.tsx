import type { Metadata } from "next";
import { Suspense } from "react";
import { Quote } from "lucide-react";
import { Pager } from "@/components/common/pagination/pager";
import { parseTableParams } from "@/components/common/table/table-params";
import { PageHero } from "@/components/shared/page-hero2";
import { Section } from "@/components/shared/section";
import { getPublicTestimonialsAction } from "@/features/testimonial/actions";
import TestimonialCard from "@/components/common/card/testimonialCard";
import { AutoRefresh } from "@/components/shared/auto-refresh";
import { Bone } from "@/components/skeleton/sections";

export const metadata: Metadata = { title: "Testimonials | TicketBooking" };

const PER_PAGE = 3;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function TestimonialsGridSkeleton() {
  return (
    <Section className="pt-10 sm:pt-12">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass space-y-4 rounded-4xl p-7">
            <Bone className="size-8 rounded-md" />
            <div className="space-y-2">
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-5/6" />
              <Bone className="h-4 w-3/4" />
            </div>
            <div className="flex items-center gap-3 pt-4">
              <Bone className="size-10 rounded-full" />
              <div className="space-y-1.5">
                <Bone className="h-4 w-28" />
                <Bone className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

async function TestimonialsGrid({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const params = parseTableParams(raw, [], PER_PAGE);
  const res = await getPublicTestimonialsAction(params);
  const items = res.testimonials ?? [];

  return (
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
  );
}

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <>
      <AutoRefresh />
      <PageHero title="Testimonials" subtitle="Hear what our customers have to say about their experience with us." />
      <Suspense fallback={<TestimonialsGridSkeleton />}>
        <TestimonialsGrid searchParams={searchParams} />
      </Suspense>
    </>
  );
}

 