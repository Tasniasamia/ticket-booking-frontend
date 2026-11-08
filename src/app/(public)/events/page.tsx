import type { Metadata } from "next";
import { Suspense } from "react";
import { EventsExplorer } from "@/components/dashboard/events/events-explorer";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { getEventCategoriesAction } from "@/features/event-category/actions";
import { getPublicEventsAction } from "@/features/event/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { getPageContent } from "@/features/settings/server";
import { parseTableParams } from "@/components/common/table/table-params";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";
import { Bone, EventCardSkeleton } from "@/components/skeleton/sections";

export const metadata: Metadata = { title: "Events | TicketBooking" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const EVENTS_PER_PAGE = 3;

function EventsGridSkeleton() {
  return (
    <Section className="pt-10 sm:pt-12">
      <div className="mb-10">
        <Bone className="h-12 w-full max-w-md rounded-full" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </Section>
  );
}

async function EventsGrid({ searchParams, lang }: { searchParams: SearchParams; lang: string }) {
  const raw = await searchParams;
  const params = parseTableParams(raw, ["category_id"], EVENTS_PER_PAGE);
  const [eventsRes, catRes] = await Promise.all([
    getPublicEventsAction(params, lang),
    getEventCategoriesAction(lang),
  ]);

  return (
    <Section className="pt-10 sm:pt-12">
      {eventsRes.success && eventsRes.events && eventsRes.meta ? (
        <EventsExplorer events={eventsRes.events} meta={eventsRes.meta} categories={catRes.eventCategories ?? []} lang={lang} />
      ) : (
        <div className="glass rounded-4xl p-12 text-center">
          <p className="text-lg font-semibold">{eventsRes.message ?? "Could not load events."}</p>
        </div>
      )}
    </Section>
  );
}

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  const [content, langRes, saved] = await Promise.all([
    getPageContent("events"),
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  return (
    <>
      <PageHero content={content} lang={lang} />
      <Suspense fallback={<EventsGridSkeleton />}>
        <EventsGrid searchParams={searchParams} lang={lang} />
      </Suspense>
    </>
  );
}
