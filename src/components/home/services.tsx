import { CreditCard, Globe, MessagesSquare, Ticket } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { LText } from "@/components/shared/localized-text";
import { T } from "@/components/shared/t";
import { section, textOf } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import type { MessageKey } from "@/lib/i18n/messages";

const SERVICES: { icon: typeof Ticket; title: MessageKey; text: MessageKey; tone: string }[] = [
  { icon: Ticket, title: "Instant booking", text: "Choose your tickets and get a unique booking code straight away.", tone: "from-violet to-magenta" },
  { icon: CreditCard, title: "Secure payments", text: "Pay by card through Stripe. Your history is saved in your account.", tone: "from-magenta to-coral" },
  { icon: MessagesSquare, title: "Live chat", text: "Ask the event manager a question and get replies in real time.", tone: "from-ice to-violet" },
  { icon: Globe, title: "Your language and currency", text: "Switch between languages and see prices in your currency.", tone: "from-coral to-magenta" },
];

export function Services({ content,lang }: { content?: PageContent; lang: string }) {
  const c = section(content, "services");
  return (
    <Section id="services">
      <SectionHeading title={textOf(c.title,lang)} subtitle={textOf(c.subtitle,lang)} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ icon: Icon, title, text, tone }, i) => (
          <article key={title} className={`glass rounded-4xl p-6 ${i % 2 ? "lg:mt-8" : ""}`}>
            <span className={`grid size-14 place-items-center rounded-2xl bg-linear-to-br ${tone}`}><Icon className="size-6" /></span>
            <h3 className="mt-6 text-lg font-bold"><T k={title} /></h3>
            <p className="mt-2 text-sm leading-relaxed text-fg/65"><T k={text} /></p>
          </article>
        ))}
      </div>
    </Section>
  );
}
