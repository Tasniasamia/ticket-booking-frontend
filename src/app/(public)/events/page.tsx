import type { Metadata } from "next";
import { Suspense } from "react";
import { EventsExplorer } from "@/components/dashboard/events/events-explorer";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { getEventCategoriesAction } from "@/features/event-category/actions";
import { getPublicEventsAction } from "@/features/event/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { getPageContent } from "@/features/settings/server";
import type { PageContent } from "@/features/settings/types";
import { parseTableParams } from "@/components/common/table/table-params";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";
import { CardPagesSkeleton } from "@/components/skeleton/common-card-skeleton";

export const metadata: Metadata = { title: "Events | TicketBooking" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const EVENTS_PER_PAGE = 3;

async function EventsContent({ content, searchParams }: { content?: PageContent; searchParams: SearchParams }) {
  const [raw, langRes, saved] = await Promise.all([searchParams, getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  // URL (?search=&category_id=&page=) → backend query। category_id ছাড়া অন্য filter যাবে না (whitelist)।
  const params = parseTableParams(raw, ["category_id"], EVENTS_PER_PAGE);
  const [eventsRes, catRes] = await Promise.all([getPublicEventsAction(params, lang), getEventCategoriesAction(lang)]);

  return (
    <>
      <PageHero content={content} lang={lang} />
      <Section className="pt-10 sm:pt-12">
        {eventsRes.success && eventsRes.events && eventsRes.meta ? (
          <EventsExplorer events={eventsRes.events} meta={eventsRes.meta} categories={catRes.eventCategories ?? []} lang={lang} />
        ) : (
          <div className="glass rounded-4xl p-12 text-center">
            <p className="text-lg font-semibold">{eventsRes.message ?? "Could not load events."}</p>
          </div>
        )}
      </Section>
    </>
  );
}

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  const content = await getPageContent("events"); // cached, Suspense এর বাইরে ঠিক আছে
  // searchParams runtime data, তাই await টা Suspense এর ভেতরে (cacheComponents এর নিয়ম)
  return (
    <Suspense fallback={<CardPagesSkeleton />}>
      <EventsContent content={content} searchParams={searchParams} />
    </Suspense>
  );
}
