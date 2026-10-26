import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { getPageContent } from "@/features/settings/server";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage} from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";
import { getUpcomingEventsAction } from "@/features/event/actions";

async function HomeHero({ content}: { content: Awaited<ReturnType<typeof getPageContent>>}) {
  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

 const res = await getUpcomingEventsAction(1); // hero তে ১টা
const event = res.events?.data?.docs[0];



  return <Hero content={content} lang={lang} event={event} />;
}

export default async function HomePage() {
  const content = await getPageContent("home"); // cached — Suspense বাইরে OK
 

  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
      <HomeHero content={content}  />
    </Suspense>
  );
}