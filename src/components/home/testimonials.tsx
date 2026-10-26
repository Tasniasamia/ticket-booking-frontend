import { Quote } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { LText } from "@/components/shared/localized-text";
import { section } from "@/features/settings/localized";
import type { PageContent } from "@/features/settings/types";
import { TESTIMONIALS } from "@/lib/mock-data";
import { UserAvatar } from "../shared/use-avatar";

export function Testimonials({ content }: { content?: PageContent }) {
  const c = section(content, "testimonials");
  return (
    <Section id="testimonials">
      <SectionHeading title={<LText value={c.title} fallback="What our guests say" />} subtitle={c.subtitle ? <LText value={c.subtitle} /> : undefined} />
      <div className="grid gap-5 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <figure key={t.name} className={`rounded-4xl p-7 ${i === 1 ? "btn-grad lg:-translate-y-4" : "glass"}`}>
            <Quote className="size-8 opacity-60" />
            <blockquote className="mt-4 leading-relaxed">{t.text}</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <UserAvatar name={t.name} />
              <div><p className="font-semibold">{t.name}</p><p className="text-sm opacity-70">{t.role}</p></div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
