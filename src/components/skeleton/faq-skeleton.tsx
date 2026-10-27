import { Bone, PageTitleSkeleton, WRAP } from "./sections";

export function FaqSkeleton() {
  const widths = ["w-48", "w-64", "w-40", "w-60", "w-72", "w-64"];
  return (
    <div role="status" aria-busy="true" aria-label="Loading">
      <PageTitleSkeleton />

      {/* accordion rows (narrow, centered) */}
      <section className={`${WRAP} max-w-2xl space-y-3 pb-6 pt-8`}>
        {widths.map((w, i) => (
          <div
            key={i}
            className="flex h-14 items-center justify-between rounded-2xl border border-fg/10 bg-fg/5 px-4"
          >
            <Bone className={`h-4 ${w} max-w-[75%]`} />
            <Bone className="size-4 rounded-full" />
          </div>
        ))}
        <div className="flex justify-center pt-6 pb-10">
          <Bone className="h-4 w-52" />
        </div>
      </section>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
