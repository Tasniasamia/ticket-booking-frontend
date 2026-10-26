import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddEventButton } from "@/components/dashboard/manager/events/add-event-button";
import { ManagerEventTable } from "@/components/dashboard/manager/events/manager-event-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getCurrenciesAction } from "@/features/currency/actions";
import { getEventCategoriesAction } from "@/features/event-category/actions";
import { getMyEventsAction } from "@/features/event/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage, textOf } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";

export const metadata: Metadata = { title: "My events" };

export default async function ManagerEventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["status"]);

  const [langRes, curRes, saved] = await Promise.all([
    getLanguagesAction(),
    getCurrenciesAction(),
    getLanguageCookie(),
  ]);
  const languages = langRes.languages ?? [];
  const currencies = curRes.currencies ?? [];
  const lang = pickLanguage(languages, saved);

  const [res, catRes] = await Promise.all([getMyEventsAction(params, lang), getEventCategoriesAction(lang)]);

  // form এর category select এর জন্য
  const categories = (catRes.eventCategories ?? []).map((c) => ({
    value: String(c.id),
    label: textOf(c.name, lang),
  }));

  return (
    <div>
      <PageHeader
        title="My Events"
        subtitle="Events you created. New events stay pending until an admin approves them."
        actions={<AddEventButton languages={languages} categories={categories} currencies={currencies} />}
      />
      {res.success && res.events && res.meta ? (
        <ManagerEventTable
          events={res.events}
          meta={res.meta}
          lang={lang}
          languages={languages}
          categories={categories}
          currencies={currencies}
        />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load events" description={res.message} />
      )}
    </div>
  );
}
