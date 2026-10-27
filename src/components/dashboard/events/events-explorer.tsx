import Link from "next/link";
import { SearchFilterBar } from "@/components/common/filters/search-filter-bar";
import { Pager } from "@/components/common/pagination/pager";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { T } from "@/components/shared/t";
import type { EventItem } from "@/features/event/types";
import { EventCard } from "./event-card";

type Props = {
  events: EventItem[];
  meta: PaginationMeta;
  categories: { id: number; name: string }[];
  lang: string;
};

/**
 * /events এর পুরো list অংশ। Data page থেকে আসে (backend search + category + pagination),
 * এখানে শুধু সাজানো: SearchFilterBar → grid → Pager। তিনটাই reusable, URL ই state।
 */
export function EventsExplorer({ events, meta, categories, lang }: Props) {
  return (
    <div>
      <SearchFilterBar
        className="mb-10"
        placeholder="Search by name or city"
        filters={[{ key: "category_id", label: "Category", options: categories.map((c) => ({ value: String(c.id), label: c.name })) }]}
      />

      {events.length ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => <EventCard key={e.id} event={e} lang={lang} />)}
          </div>
          <Pager meta={meta} />
        </>
      ) : (
        <div className="glass rounded-4xl p-12 text-center">
          <p className="text-lg font-semibold"><T k="No events match your search" /></p>
          <p className="mt-2 text-fg/60"><T k="Try a different name or choose another category." /></p>
          <Link href="/events" className="btn-grad mt-6 inline-block rounded-full px-6 py-2.5 font-semibold"><T k="Clear filters" /></Link>
        </div>
      )}
    </div>
  );
}
