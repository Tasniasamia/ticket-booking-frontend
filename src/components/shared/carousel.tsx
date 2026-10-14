"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Native scroll-snap slider: touch/trackpad swipe + arrow buttons. কোনো library লাগে না। */
export function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const btn =
    "grid size-11 place-items-center rounded-full glass transition hover:bg-fg/20 focus-visible:outline-2 focus-visible:outline-coral";

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2">
        <button type="button" onClick={() => scroll(-1)} aria-label={`Previous ${label}`} className={btn}>
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label={`Next ${label}`} className={btn}>
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
      >
        {children}
      </div>
    </div>
  );
}

export function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("shrink-0 basis-[82%] snap-start sm:basis-[46%] lg:basis-[31.5%] xl:basis-[23.5%]", className)}
      {...props}
    />
  );
}
