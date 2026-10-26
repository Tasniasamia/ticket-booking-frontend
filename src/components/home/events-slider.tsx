import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { Section, SectionHeading } from "@/components/shared/section";
import { LText } from "@/components/shared/localized-text";
import { section, textOf } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import { EventCard } from "@/components/dashboard/events/event-card";
import { EVENTS } from "@/lib/mock-data";

export function EventsSlider({ content, lang }: { content?: PageContent; lang: string }) {
  const c = section(content, "events");
  return (
    <Section id="events">
      <SectionHeading title={textOf(c.title,lang)} subtitle={textOf(c.subtitle,lang)} href="/events" />
      <Carousel label="events">
        {EVENTS.map((e) => (
          <CarouselItem key={e.id}><EventCard event={e} /></CarouselItem>
        ))}
      </Carousel>
    </Section>
  );
}
