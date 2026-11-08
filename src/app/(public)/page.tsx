import { Suspense } from "react";
import { getPageContent } from "@/features/settings/server";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";
import { getTrendingEventsAction } from "@/features/event/actions";
import { getPublicManagersAction } from "@/features/user/actions";
import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { EventsSlider } from "@/components/home/events-slider";
import { Hero } from "@/components/home/hero";
import { ManagersSlider } from "@/components/home/managers-slider";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { AutoRefresh } from "@/components/shared/auto-refresh";
import { Faq } from "@/components/home/faq";
import { ManagersSkeleton, TestimonialsSkeleton } from "@/components/skeleton/sections";
import { FaqSkeleton } from "@/components/skeleton/faq-skeleton";

async function HomeHero({
  content,
}: {
  content: Awaited<ReturnType<typeof getPageContent>>;
}) {
  const [langRes, saved, trendingRes, managersRes] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
    getTrendingEventsAction(8),
    getPublicManagersAction(12),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const events = trendingRes.events ?? [];
  const managers = managersRes.managers ?? [];

  return (
    <>
      <AutoRefresh />
      <Hero content={content} lang={lang} event={events[0]} managers={managers} />
      <About content={content} lang={lang} />
      <Services content={content} lang={lang} />
      <EventsSlider content={content} lang={lang} events={events} />

      <Suspense fallback={<ManagersSkeleton />}>
        <ManagersSlider content={content} lang={lang} managers={managers} />
      </Suspense>

      <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials content={content} lang={lang} />
      </Suspense>

      <Suspense fallback={<FaqSkeleton />}>
        <Faq lang={lang} />
      </Suspense>

      <Contact content={content} lang={lang} />
    </>
  );
}

export default async function HomePage() {
  const content = await getPageContent("home"); // cached — Suspense বাইরে OK

  return <HomeHero content={content} />;
}
