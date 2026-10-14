import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { Section, SectionHeading } from "@/components/shared/section";
import { EventCard } from "@/components/events/event-card";
import { EVENTS } from "@/lib/mock-data";

export function EventsSlider() {
  return (
    <Section id="events">
      <SectionHeading title="Trending events" subtitle="The most booked shows this month. Swipe or use the arrows to see more." href="/events" />
      <Carousel label="events">
        {EVENTS.map((e) => (
          <CarouselItem key={e.id}><EventCard event={e} /></CarouselItem>
        ))}
      </Carousel>
    </Section>
  );
}
