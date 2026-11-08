import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { LiveRefresh } from "@/components/shared/live-refresh";
import { Section, SectionHeading } from "@/components/shared/section";
import { section, textOf } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import type { EventItem } from "@/features/event/types";
import { EventCard } from "@/components/dashboard/events/event-card";
import { getTrendingEventsAction } from "@/features/event/actions";
import { Suspense } from "react";

/** Trending events। Hero এর সাথে একই data, Home page একবার fetch করে দুই জায়গায় পাঠায়। */
export async function EventsSlider({
  content,
  lang,
  events: initialEvents,
}: {
  content?: PageContent;
  lang: string;
  events?: EventItem[];
}) {
  const c = section(content, "events");

  const events =
    initialEvents ??
    (await getTrendingEventsAction(8)).events ??
    [];



  return (
    <Section id="events">
      <LiveRefresh />
      <SectionHeading title={textOf(c.title, lang)} subtitle={textOf(c.subtitle, lang)} href="/events" />
      {/* <Suspense fallback={<p>Loading...</p>}> */}
  <Carousel label="events">
        {events.map((e) => (
          <CarouselItem key={e.id}><EventCard event={e} lang={lang} /></CarouselItem>
        ))}
      </Carousel>
      {/* </Suspense> */}
    
    </Section>
  );
}
