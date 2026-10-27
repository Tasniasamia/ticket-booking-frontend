import { Bone, EventCardSkeleton, PageTitleSkeleton, WRAP } from "./sections";

export function EventsSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading">
      <PageTitleSkeleton />

      {/* search + category chips */}
      <section className={`${WRAP} flex flex-wrap items-center justify-between gap-4 py-6`}>
        <Bone className="h-11 w-full max-w-sm rounded-full" />
        <div className="flex flex-wrap gap-2">
          {["w-20", "w-24", "w-24", "w-16", "w-20"].map((w, i) => (
            <Bone key={i} className={`h-9 rounded-full ${w}`} />
          ))}
        </div>
      </section>

      {/* event grid (3 columns) */}
      <section className={`${WRAP} grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </section>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
