import type { Metadata } from "next";
import { ManagerCard } from "@/components/common/card/manager-card";
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
import { parseTableParams } from "@/components/common/table/table-params";
import { Pager } from "@/components/common/pagination/pager";

export const metadata: Metadata = { title: "Event managers | TicketBooking" };
const PER_PAGE = 9;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function ManagerContent({
  searchParams,
  content,
}: {
  content?: PageContent;
  searchParams: SearchParams;
}) {
  const [raw, langRes, saved] = await Promise.all([
    searchParams,
    getLanguagesAction(),
    getLanguageCookie(),
    // getPublicManagersAction(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const params = parseTableParams(raw, [], PER_PAGE);
  const res = await getPublicManagersAction(params);
  const managers = res.managers ?? [];

  return (
    <>
      <PageHero content={content} lang={lang} />
      <Section className="pt-10 sm:pt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {managers.length === 0 ? (
            <p className="col-span-full text-fg/60">
              No managers available yet.
            </p>
          ) : (
            managers.map((m) => (
              <ManagerCard
                key={m.id}
                m={{
                  id: String(m.id),
                  name: m.name,
                  org: m.designation || m.country || "Event Manager",
                  image: m.profile_image?.trim() || "/default.jpg",
                  events: 0,
                  rating: 0,
                }}
              />
            ))
          )}
        </div>
        {res.meta ? <Pager meta={res.meta} /> : null}
      </Section>
    </>
  );
}

export default async function ManagersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const content = await getPageContent("managers");
  return (
    <Suspense fallback={<CardPagesSkeleton />}>
      <ManagerContent content={content} searchParams={searchParams} />
    </Suspense>
  );
}
