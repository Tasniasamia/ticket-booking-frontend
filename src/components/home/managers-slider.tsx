import { ManagerCard } from "@/components/managers/manager-card";
import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { Section, SectionHeading } from "@/components/shared/section";
import { LText } from "@/components/shared/localized-text";
import { section, textOf } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import { MANAGERS } from "@/lib/mock-data";

export function ManagersSlider({ content, lang }: { content?: PageContent; lang: string }) {
  const c = section(content, "managers");
  return (
    <Section id="managers">
      <SectionHeading title={textOf(c.title,lang)} subtitle={textOf(c.subtitle,lang)} />
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
