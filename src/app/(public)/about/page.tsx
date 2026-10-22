import type { Metadata } from "next";
import { About } from "@/components/home/about";
import { ManagersSlider } from "@/components/home/managers-slider";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { T } from "@/components/shared/t";
import type { MessageKey } from "@/lib/i18n/messages";

export const metadata: Metadata = { title: "About us | TicketBooking" };

const VALUES: { title: MessageKey; text: MessageKey }[] = [
  { title: "Clear prices", text: "You see the full price in your own currency before you pay." },
  { title: "Real organisers", text: "Every manager is verified before they can publish an event." },
  { title: "Help when you need it", text: "Message the organiser or our team and get a quick reply." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title={<T k="About TicketBooking" />} subtitle={<T k="We help people find live events and help organisers fill them." />} />
      <About />
      <Section className="pt-0 sm:pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="glass rounded-4xl p-7">
              <h3 className="text-xl font-bold"><T k={v.title} /></h3>
              <p className="mt-2 leading-relaxed text-fg/65"><T k={v.text} /></p>
            </div>
          ))}
        </div>
      </Section>
      <Services />
      <ManagersSlider />
      <Testimonials />
    </>
  );
}
