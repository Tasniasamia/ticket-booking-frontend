import type { Metadata } from "next";
import { ManagerCard } from "@/components/managers/manager-card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { MANAGERS } from "@/lib/mock-data";
import { getPageContent } from "@/features/settings/server";
import { PageContent } from "@/features/settings/types";
import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import { pickLanguage } from "@/lib/localized";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Event managers | TicketBooking" };

export async function ManagerContent({ content }: { content?: PageContent }) {
const [langRes, saved] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  return (
    <>
      <PageHero content={content} lang={lang}/>
      <Section className="pt-10 sm:pt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MANAGERS.map((m) => <ManagerCard key={m.id} m={m} />)}
        </div>
      </Section>
    </>
  );
}


export default async function ManagersPage() {
  const content = await getPageContent("managers");

  return (
      <Suspense
          fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}
        > 
            <ManagerContent content={content} />

        </Suspense>
  )
  
}