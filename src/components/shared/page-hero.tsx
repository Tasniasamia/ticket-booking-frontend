import { PageContent } from "@/features/settings/types";
import { Container } from "./section";
import { section, textOf } from "@/lib/localized";

export function PageHero({content,lang}: { content?: PageContent, lang:string}) {
    const c = section(content, "hero");
    console.log("home pages ",c)
  return (
    <section className="pb-6 pt-14 sm:pt-20">
      <Container>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">{textOf(c.title,lang)}</h1>
        {textOf(c.subtitle,lang) && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg/65">{textOf(c.subtitle,lang)}</p>}
      </Container>
    </section>
  );
}
