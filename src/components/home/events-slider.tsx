import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { Section, SectionHeading } from "@/components/shared/section";
import { T } from "@/components/shared/t";
import { EventCard } from "@/components/dashboard/events/event-card";
import { EVENTS } from "@/lib/mock-data";

export function EventsSlider() {
  return (
    <Section id="events">
      <SectionHeading title={<T k="Trending events" />} subtitle={<T k="The most booked shows this month. Swipe or use the arrows to see more." />} href="/events" />
      <Carousel label="events">
        {EVENTS.map((e) => (
          <CarouselItem key={e.id}><EventCard event={e} /></CarouselItem>
        ))}
      </Carousel>
    </Section>
  );
}
