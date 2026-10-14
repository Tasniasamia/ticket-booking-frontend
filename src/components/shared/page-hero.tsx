import { Container } from "./section";

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="pb-6 pt-14 sm:pt-20">
      <Container>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg/65">{subtitle}</p>}
      </Container>
    </section>
  );
}
