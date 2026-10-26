import { ManagerCard } from "@/components/managers/manager-card";
import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { Section, SectionHeading } from "@/components/shared/section";
import { LText } from "@/components/shared/localized-text";
import { section } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import { MANAGERS } from "@/lib/mock-data";

export function ManagersSlider({ content }: { content?: PageContent }) {
  const c = section(content, "managers");
  return (
    <Section id="managers">
      <SectionHeading title={<LText value={c.title} fallback="Meet the event managers" />} subtitle={<LText value={c.subtitle} fallback="The people behind the shows. Open a profile to see their events and ask questions." />} />
      <Carousel label="managers">
        {MANAGERS.map((m) => (
          <CarouselItem key={m.id} className="xl:basis-[23.5%]">
            <ManagerCard m={m} />
          </CarouselItem>
        ))}
      </Carousel>
    </Section>
  );
}
