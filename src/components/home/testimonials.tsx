import { Section, SectionHeading } from "@/components/shared/section";
import { section, textOf } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import { getPublicTestimonialsAction } from "@/features/testimonial/actions";
import { T } from "@/components/shared/t";
import TestimonialCard from "../common/card/testimonialCard";

export async function Testimonials({
  content,
  lang,
}: {
  content?: PageContent;
  lang: string;
}) {
  const c = section(content, "testimonials");
  const res = await getPublicTestimonialsAction(3);
  const items = res.testimonials ?? [];
  if (items.length === 0) return null;

  return (
    <Section id="testimonials">
      <SectionHeading
        title={textOf(c.title, lang)}
        subtitle={textOf(c.subtitle, lang)}
        href="/testimonials"
        hrefLabel={<T k="View all" />}
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((t, i) => (
                <TestimonialCard t={t} i={i} key={t.id} />
        ))}
      </div>
    </Section>
  );
}
