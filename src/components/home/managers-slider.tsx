import { ManagerCard } from "@/components/managers/manager-card";
import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { Section, SectionHeading } from "@/components/shared/section";
import { MANAGERS } from "@/lib/mock-data";

export function ManagersSlider() {
  return (
    <Section id="managers">
      <SectionHeading title="Meet the event managers" subtitle="The people behind the shows. Open a profile to see their events and ask questions." />
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
