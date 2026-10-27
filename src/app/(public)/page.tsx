import { Suspense } from "react";
import { getPageContent } from "@/features/settings/server";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";
import { getTrendingEventsAction } from "@/features/event/actions";
import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { EventsSlider } from "@/components/home/events-slider";
import { Hero } from "@/components/home/hero";
import { ManagersSlider } from "@/components/home/managers-slider";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { HomeSkeleton } from "@/components/skeleton/home-skeleton";
async function HomeHero({
  content,
}: {
  content: Awaited<ReturnType<typeof getPageContent>>;
}) {
  const [langRes, saved] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  // trending একবারই আনি: প্রথমটা Hero তে, পুরো list slider এ
  const { events } = await getTrendingEventsAction(8);

  return (
    <>
      <Hero content={content} lang={lang} event={events[0]} />
      <About content={content} lang={lang} />
            <Services content={content} lang={lang}/>
                <EventsSlider content={content} lang={lang} events={events} />
      <ManagersSlider content={content} lang={lang}/>
      <Testimonials content={content} lang={lang}/>
      <Contact content={content} lang={lang} />

    </>
  );
}

export default async function HomePage() {
  const content = await getPageContent("home"); // cached — Suspense বাইরে OK

  return (
    <Suspense
      fallback={<HomeSkeleton/>}
    >
      <HomeHero content={content} />
    </Suspense>
  );
}
