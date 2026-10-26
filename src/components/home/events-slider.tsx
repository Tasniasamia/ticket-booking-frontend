import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { Section, SectionHeading } from "@/components/shared/section";
import { LText } from "@/components/shared/localized-text";
import { section } from "@/features/settings/localized";
import type { PageContent } from "@/features/settings/types";
import { EventCard } from "@/components/dashboard/events/event-card";
import { EVENTS } from "@/lib/mock-data";

export function EventsSlider({ content }: { content?: PageContent }) {
  const c = section(content, "events");
  return (
    <Section id="events">
      <SectionHeading title={<LText value={c.title} fallback="Trending events" />} subtitle={<LText value={c.subtitle} fallback="The most booked shows this month. Swipe or use the arrows to see more." />} href="/events" />
      <Carousel label="events">
        {EVENTS.map((e) => (
          <CarouselItem key={e.id}><EventCard event={e} /></CarouselItem>
        ))}
      </Carousel>
    </Section>
  );
}
