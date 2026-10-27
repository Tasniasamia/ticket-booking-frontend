import {
  AboutBlockSkeleton, Bone, ContactBlockSkeleton, EventsSliderSkeleton,
  ManagersSkeleton, ServicesSkeleton, TestimonialsSkeleton, WRAP,
} from "./sections";

export function HomeSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading">
      {/* Hero */}
      <section className={`${WRAP} grid items-center gap-10 py-16 md:grid-cols-2`}>
        <div className="space-y-5">
          <Bone className="h-12 w-4/5" />
          <Bone className="h-12 w-3/5" />
          <div className="space-y-2 pt-2">
            <Bone className="h-4 w-full max-w-md" />
            <Bone className="h-4 w-3/4 max-w-md" />
          </div>
          <Bone className="h-12 w-full max-w-md rounded-full" />
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <Bone key={i} className="size-8 rounded-full ring-2 ring-bg" />
              ))}
            </div>
            <Bone className="h-3 w-40" />
          </div>
        </div>
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm rotate-2">
          <Bone className="absolute inset-0 rounded-[2rem]" />
          <Bone className="absolute right-4 top-4 h-6 w-20 rounded-full bg-fg/20" />
          <div className="absolute inset-x-4 bottom-4 space-y-2 rounded-2xl bg-bg/40 p-4">
            <Bone className="h-4 w-48 bg-fg/20" />
            <Bone className="h-3 w-32 bg-fg/20" />
            <Bone className="h-8 w-24 rounded-full bg-fg/20" />
          </div>
        </div>
      </section>

      <AboutBlockSkeleton />
      <ServicesSkeleton />
      <EventsSliderSkeleton />
      <ManagersSkeleton />
      <TestimonialsSkeleton />
      <ContactBlockSkeleton />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
