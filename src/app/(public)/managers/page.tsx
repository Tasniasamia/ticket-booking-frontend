import type { Metadata } from "next";
import { ManagerCard } from "@/components/managers/manager-card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { getPageContent } from "@/features/settings/server";
import type { PageContent } from "@/features/settings/types";
import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import { pickLanguage } from "@/lib/localized";
import { Suspense } from "react";
import { CardPagesSkeleton } from "@/components/skeleton/common-card-skeleton";
import { getPublicManagersAction } from "@/features/user/actions";

export const metadata: Metadata = { title: "Event managers | TicketBooking" };

export async function ManagerContent({ content }: { content?: PageContent }) {
  const [langRes, saved, managersRes] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
    getPublicManagersAction(50),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const managers = managersRes.managers ?? [];

  return (
    <>
      <PageHero content={content} lang={lang} />
      <Section className="pt-10 sm:pt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {managers.length === 0 ? (
            <p className="col-span-full text-fg/60">No managers available yet.</p>
          ) : (
            managers.map((m) => (
              <ManagerCard
                key={m.id}
                m={{
                  id: String(m.id),
                  name: m.name,
                  org: m.designation || m.country || "Event Manager",
                  image: m.profile_image || "",
                  events: 0,
                  rating: 0,
                }}
              />
            ))
          )}
        </div>
      </Section>
    </>
  );
}

export default async function ManagersPage() {
  const content = await getPageContent("managers");
  return (
    <Suspense fallback={<CardPagesSkeleton />}>
      <ManagerContent content={content} />
    </Suspense>
  );
}
