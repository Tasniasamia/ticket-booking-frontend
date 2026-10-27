import { Bone, PageTitleSkeleton, WRAP } from "./sections";

export function BlogSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading">
      <PageTitleSkeleton />

      <section className={`${WRAP} space-y-4 pb-16 pt-8`}>
        {/* featured post: image left, text right */}
        <div className="grid gap-4 rounded-3xl border border-fg/10 bg-fg/5 p-2.5 md:grid-cols-5">
          <Bone className="h-56 w-full rounded-2xl md:col-span-3 md:h-60" />
          <div className="flex flex-col justify-center space-y-3 p-4 md:col-span-2">
            <Bone className="h-3 w-16" />
            <Bone className="h-7 w-full" />
            <Bone className="h-7 w-3/4" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-2/3" />
            <Bone className="h-3 w-48" />
          </div>
        </div>

        {/* 3 post cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3 rounded-3xl border border-fg/10 bg-fg/5 p-2.5">
              <Bone className="h-40 w-full rounded-2xl" />
              <div className="space-y-2 px-2.5 pb-3">
                <Bone className="h-3 w-12" />
                <Bone className="h-5 w-full" />
                <Bone className="h-5 w-2/3" />
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-4/5" />
                <Bone className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </section>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
