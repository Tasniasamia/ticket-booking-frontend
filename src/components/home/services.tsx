import { CreditCard, Globe, MessagesSquare, Ticket } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";

const SERVICES = [
  { icon: Ticket, title: "Instant booking", text: "Choose your tickets and get a unique booking code straight away.", tone: "from-violet to-magenta" },
  { icon: CreditCard, title: "Secure payments", text: "Pay by card through Stripe. Your history is saved in your account.", tone: "from-magenta to-coral" },
  { icon: MessagesSquare, title: "Live chat", text: "Ask the event manager a question and get replies in real time.", tone: "from-ice to-violet" },
  { icon: Globe, title: "Your language and currency", text: "Switch between English and বাংলা, and see prices in your currency.", tone: "from-coral to-magenta" },
];

export function Services() {
  return (
    <Section id="services">
      <SectionHeading title="Everything you need for the night" subtitle="From the first search to the front door, each step is handled in one place." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ icon: Icon, title, text, tone }, i) => (
          <article key={title} className={`glass rounded-4xl p-6 ${i % 2 ? "lg:mt-8" : ""}`}>
            <span className={`grid size-14 place-items-center rounded-2xl bg-linear-to-br ${tone}`}><Icon className="size-6" /></span>
            <h3 className="mt-6 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg/65">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
