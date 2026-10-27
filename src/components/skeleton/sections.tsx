// Shared skeleton building blocks (components/skeletons/sections.tsx)
export const WRAP = "mx-auto w-full max-w-6xl px-4 sm:px-6";

export function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`motion-safe:animate-pulse rounded-xl bg-fg/10 ${className}`}
    />
  );
}

function SectionHead({ withLink = false }: { withLink?: boolean }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div className="space-y-3">
        <Bone className="h-8 w-64 max-w-full" />
        <Bone className="h-4 w-80 max-w-full" />
      </div>
      {withLink && <Bone className="h-4 w-12" />}
    </div>
  );
}

function Arrows() {
  return (
    <div className="mb-4 flex justify-end gap-2">
      <Bone className="size-9 rounded-full" />
      <Bone className="size-9 rounded-full" />
    </div>
  );
}

/** Two overlapping images on the left, copy + checklist + button on the right */
export function AboutBlockSkeleton() {
  return (
    <section className={`${WRAP} grid items-center gap-10 py-16 md:grid-cols-2`}>
      <div className="relative mx-auto h-80 w-full max-w-md">
        <Bone className="absolute left-0 top-0 h-64 w-56 -rotate-3 rounded-3xl" />
        <Bone className="absolute bottom-0 right-0 h-56 w-52 rotate-3 rounded-3xl" />
      </div>
      <div className="space-y-4">
        <Bone className="h-8 w-64" />
        <Bone className="h-4 w-full max-w-sm" />
        <Bone className="h-4 w-5/6 max-w-sm" />
        <Bone className="h-4 w-2/3 max-w-sm" />
        <div className="space-y-3 pt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Bone className="size-5 rounded-full" />
              <Bone className="h-4 w-56 max-w-full" />
            </div>
          ))}
        </div>
        <Bone className="mt-4 h-11 w-40 rounded-full" />
      </div>
    </section>
  );
}

/** 4 feature cards (staggered like the real layout) */
export function ServicesSkeleton() {
  return (
    <section className={`${WRAP} py-16`}>
      <SectionHead />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`space-y-4 rounded-3xl border border-fg/10 bg-fg/5 p-5 ${
              i % 2 === 1 ? "lg:mt-4" : ""
            }`}
          >
            <Bone className="size-11 rounded-xl" />
            <Bone className="h-5 w-32" />
            <div className="space-y-2">
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Trending events carousel: date badge, price pill, title, venue, avatars, button */
export function EventsSliderSkeleton() {
  return (
    <section className={`${WRAP} py-16`}>
      <SectionHead withLink />
      <Arrows />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 rounded-3xl border border-fg/10 bg-fg/5 p-2.5">
            <Bone className="h-32 w-full rounded-2xl" />
            <div className="space-y-2 px-1.5">
              <Bone className="h-4 w-4/5" />
              <Bone className="h-3 w-1/2" />
            </div>
            <div className="flex items-center justify-between px-1.5 pb-1">
              <Bone className="h-6 w-24 rounded-full" />
              <Bone className="h-8 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Manager portrait cards with rating chip + name + button overlay */
export function ManagersSkeleton() {
  return (
    <section className={`${WRAP} py-16`}>
      <SectionHead />
      <Arrows />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-3xl">
            <Bone className="absolute inset-0 rounded-3xl" />
            <Bone className="absolute right-3 top-3 h-5 w-12 rounded-full bg-fg/20" />
            <div className="absolute inset-x-3 bottom-3 space-y-2 rounded-2xl bg-bg/40 p-3">
              <Bone className="h-4 w-28 bg-fg/20" />
              <Bone className="h-3 w-36 bg-fg/20" />
              <Bone className="h-9 w-full rounded-full bg-fg/20" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** 3 quote cards, middle one slightly taller */
export function TestimonialsSkeleton() {
  return (
    <section className={`${WRAP} py-16`}>
      <Bone className="mb-8 h-8 w-56" />
      <div className="grid items-start gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`space-y-4 rounded-3xl border border-fg/10 bg-fg/5 p-5 ${
              i === 1 ? "md:-mt-2 md:pb-8" : ""
            }`}
          >
            <Bone className="size-6 rounded-md" />
            <div className="space-y-2">
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-3/4" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Bone className="size-10 rounded-full" />
              <div className="space-y-2">
                <Bone className="h-3 w-24" />
                <Bone className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Left: heading + 3 info rows. Right: form card */
export function ContactBlockSkeleton() {
  return (
    <section className={`${WRAP} grid gap-8 py-16 md:grid-cols-2`}>
      <div className="space-y-4">
        <Bone className="h-8 w-60" />
        <Bone className="h-4 w-52" />
        <div className="space-y-3 pt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-fg/10 bg-fg/5 p-3">
              <Bone className="size-11 rounded-xl" />
              <div className="space-y-2">
                <Bone className="h-3 w-12" />
                <Bone className="h-4 w-44" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3 rounded-3xl border border-fg/10 bg-fg/5 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Bone className="h-10 w-full" />
          <Bone className="h-10 w-full" />
        </div>
        <Bone className="h-10 w-full" />
        <Bone className="h-28 w-full" />
        <Bone className="h-10 w-36 rounded-full" />
      </div>
    </section>
  );
}

export function PageTitleSkeleton() {
  return (
    <header className={`${WRAP} space-y-3 pb-4 pt-12`}>
      <Bone className="h-10 w-72 max-w-full" />
      <Bone className="h-4 w-96 max-w-full" />
    </header>
  );
}

/** Single event card (image + date badge + price pill + title + venue + footer) */
export function EventCardSkeleton() {
  return (
    <div className="space-y-3 rounded-3xl border border-fg/10 bg-fg/5 p-2.5">
      <Bone className="h-44 w-full rounded-2xl" />
      <div className="space-y-2 px-1.5">
        <Bone className="h-4 w-4/5" />
        <Bone className="h-3 w-1/2" />
      </div>
      <div className="flex items-center justify-between px-1.5 pb-1">
        <Bone className="h-6 w-24 rounded-full" />
        <Bone className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}
