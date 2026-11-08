import type { Metadata } from "next";
import { Suspense } from "react";
import { ManagerCard } from "@/components/common/card/manager-card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { getPageContent } from "@/features/settings/server";
import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import { pickLanguage } from "@/lib/localized";
import { getPublicManagersAction } from "@/features/user/actions";
import { parseTableParams } from "@/components/common/table/table-params";
import { Pager } from "@/components/common/pagination/pager";
import { Bone } from "@/components/skeleton/sections";

export const metadata: Metadata = { title: "Event managers | TicketBooking" };
const PER_PAGE = 9;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function ManagersGridSkeleton() {
  return (
    <Section className="pt-10 sm:pt-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="relative aspect-3/4 overflow-hidden rounded-4xl bg-fg/5 p-4">
            <Bone className="absolute inset-0 rounded-4xl" />
            <div className="absolute inset-x-3 bottom-3 space-y-2 rounded-3xl bg-bg/40 p-4">
              <Bone className="h-5 w-3/4" />
              <Bone className="h-3 w-1/2" />
              <Bone className="h-9 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

async function ManagersGrid({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const params = parseTableParams(raw, [], PER_PAGE);
  const res = await getPublicManagersAction(params);
  const managers = res.managers ?? [];

  return (
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
  );
}

export default async function ManagersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [content, langRes, saved] = await Promise.all([
    getPageContent("managers"),
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  return (
    <>
      <PageHero content={content} lang={lang} />
      <Suspense fallback={<ManagersGridSkeleton />}>
        <ManagersGrid searchParams={searchParams} />
      </Suspense>
    </>
  );
}
