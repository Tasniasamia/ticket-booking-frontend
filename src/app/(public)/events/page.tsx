import type { Metadata } from "next";
import { EventsExplorer } from "@/components/dashboard/events/events-explorer";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { Suspense } from "react";
import { getPageContent } from "@/features/settings/server";
import { PageContent } from "@/features/settings/types";
import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import { pickLanguage } from "@/lib/localized";

export const metadata: Metadata = { title: "Events | TicketBooking" };

export async function EventsContent({ content }: { content?: PageContent }) {
const [langRes, saved] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  return (
    <>
      <PageHero content={content} lang={lang}/>
      <Section className="pt-10 sm:pt-12"><EventsExplorer /></Section>
    </>
  );
}


export default async function EventsPage() {
  const content = await getPageContent("events");

  return (
      <Suspense
          fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}
        > 
            <EventsContent content={content} />

        </Suspense>
  )
  
}