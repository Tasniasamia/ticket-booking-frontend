import { Quote } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { section, textOf } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import { getPublicTestimonialsAction } from "@/features/testimonial/actions";
import { UserAvatar } from "../shared/use-avatar";

export async function Testimonials({ content, lang }: { content?: PageContent; lang: string }) {
  const c = section(content, "testimonials");
  const res = await getPublicTestimonialsAction(6);
  const items = res.testimonials ?? [];
  if (items.length === 0) return null;

  return (
    <Section id="testimonials">
      <SectionHeading title={textOf(c.title, lang)} subtitle={textOf(c.subtitle, lang)} />
      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((t, i) => (
          <figure key={t.id} className={`rounded-4xl p-7 ${i === 1 ? "btn-grad lg:-translate-y-4" : "glass"}`}>
            <Quote className="size-8 opacity-60" />
            <blockquote className="mt-4 leading-relaxed">{t.text}</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {t.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.image_url} alt={t.name} className="size-10 rounded-full object-cover" />
              ) : (
                <UserAvatar name={t.name} />
              )}
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm opacity-70">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
