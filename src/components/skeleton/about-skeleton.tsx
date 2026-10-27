import {
  AboutBlockSkeleton, Bone, ManagersSkeleton, PageTitleSkeleton,
  ServicesSkeleton, TestimonialsSkeleton, WRAP,
} from "./sections";

export function AboutSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading">
      <PageTitleSkeleton />
      <AboutBlockSkeleton />

      {/* 3 value cards: Clear prices / Real organisers / Help */}
      <section className={`${WRAP} grid gap-4 pb-8 md:grid-cols-3`}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3 rounded-3xl border border-fg/10 bg-fg/5 p-5">
            <Bone className="h-5 w-32" />
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-3/4" />
          </div>
        ))}
      </section>

      <ServicesSkeleton />
      <ManagersSkeleton />
      <TestimonialsSkeleton />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
