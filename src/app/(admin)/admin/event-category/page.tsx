import { getEventCategoryTableAction } from "@/features/event-category/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import type { PaginationMeta, TableParams } from "@/components/common/table/table-params";
import { AddEventCategoryButton } from "@/components/dashboard/admin/event-category/add-event-category-button";
import { EventCategoryTable } from "@/components/dashboard/admin/event-category/event-category-table";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const EMPTY_META: PaginationMeta = {
  totalDocs: 0,
  page: 1,
  totalPages: 1,
} as PaginationMeta;

export default async function EventCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  // URL এর query থেকে table params বানাই
  const params = {
    page: Number(first(sp.page)) || 1,
    limit: Number(first(sp.limit)) || 10,
    search: first(sp.search) ?? "",
    sort_by: first(sp.sort_by),
    sort_dir: first(sp.sort_dir),
  } as unknown as TableParams;

  // Active language গুলো (form এ field বানাতে লাগে)
  const langRes = await getLanguagesAction();
  const languages = langRes.languages ?? [];

  // Table এ কোন language এ দেখাবে: cookie র language, না থাকলে default
  const saved = await getLanguageCookie();
  const lang =
    languages.find((l) => l.code.toLowerCase() === saved?.toLowerCase())?.code ??
    languages.find((l) => l.isDefault)?.code ??
    "en";

  const res = await getEventCategoryTableAction(params, lang);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold md:text-3xl">Event categories</h1>
        <AddEventCategoryButton languages={languages} />
      </div>

      {res.success ? (
        <EventCategoryTable
          eventCategories={res.eventCategories ?? []}
          meta={res.meta ?? EMPTY_META}
          languages={languages}
        />
      ) : (
        <p className="text-sm text-red-500">
          {res.message ?? "Could not load event categories."}
        </p>
      )}
    </div>
  );
}