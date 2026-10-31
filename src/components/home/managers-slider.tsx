import { ManagerCard } from "@/components/common/card/manager-card";
import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { Section, SectionHeading } from "@/components/shared/section";
import { section, textOf } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import { getPublicManagersAction } from "@/features/user/actions";

export async function ManagersSlider({ content, lang}: { content?: PageContent; lang: string; }) {
  const c = section(content, "managers");
  const res = await getPublicManagersAction(12);
  const managers = res.managers ?? [];
  if (managers.length === 0) return null;

  return (
    <Section id="managers">
      <SectionHeading title={textOf(c.title, lang)} subtitle={textOf(c.subtitle, lang)} />
      <Carousel label="managers">
        {managers.map((m) => (
          <CarouselItem key={m.id} className="xl:basis-[23.5%]">
            <ManagerCard
              m={{
                id: String(m.id),
                name: m.name,
                org: m.designation || m.country || "Event Manager",
                image: m.profile_image?.trim() || "/default.jpg",
                events: 0,
                rating: 0,
              }}
            />
          </CarouselItem>
        ))}
      </Carousel>
    </Section>
  );
}
