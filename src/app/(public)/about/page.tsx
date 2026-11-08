import { Suspense } from "react";
import { getPageContent } from "@/features/settings/server";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";
import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { EventsSlider } from "@/components/home/events-slider";
import { ManagersSlider } from "@/components/home/managers-slider";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { PageHero } from "@/components/shared/page-hero";
import {
  EventsSliderSkeleton,
  ManagersSkeleton,
  TestimonialsSkeleton,
} from "@/components/skeleton/sections";

export const metadata = { title: "About us | TicketBooking" };

export default async function AboutPage() {
  const [aboutContent, homeContent, langRes, saved] = await Promise.all([
    getPageContent("about"),
    getPageContent("home"),
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  return (
    <>
      <PageHero content={aboutContent} lang={lang} />
      <About content={aboutContent} lang={lang} />
      <Services content={homeContent} lang={lang} />

      <Suspense fallback={<EventsSliderSkeleton />}>
        <EventsSlider content={homeContent} lang={lang} />
      </Suspense>

      <Suspense fallback={<ManagersSkeleton />}>
        <ManagersSlider content={homeContent} lang={lang} />
      </Suspense>

      <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials content={homeContent} lang={lang} />
      </Suspense>

      <Contact content={homeContent} lang={lang} />
    </>
  );
}
