export const instant=false
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddEventCategoryButton } from "@/components/dashboard/admin/event-category/add-event-category-button";
import { EventCategoryTable } from "@/components/dashboard/admin/event-category/event-category-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getEventCategoryTableAction } from "@/features/event-category/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";

export const metadata: Metadata = { title: "Event categories" };

export default async function EventCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // বাকি admin page এর মতোই: URL query → TableParams
  const params = parseTableParams(await searchParams, [], 10);

  // language list (form এর field বানাতে লাগে) আর cookie এর language একসাথে আনি
  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const languages = langRes.languages ?? [];
  const lang = pickLanguage(languages, saved);

  const res = await getEventCategoryTableAction(params, lang);

  return (
    <div>
      <PageHeader
        title="Event categories"
        subtitle="Group events into categories, in every language."
        actions={<AddEventCategoryButton languages={languages} />}
      />
      {res.success && res.meta ? (
        <EventCategoryTable
          eventCategories={res.eventCategories ?? []}
          meta={res.meta}
          languages={languages}
        />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load event categories" description={res.message} />
      )}
    </div>
  );
}
