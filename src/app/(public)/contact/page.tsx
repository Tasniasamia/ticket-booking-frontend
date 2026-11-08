import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { getPageContent } from "@/features/settings/server";
import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import { pickLanguage } from "@/lib/localized";
import { Contact } from "@/components/home/contact";

export const metadata: Metadata = { title: "Contact | TicketBooking" };

export default async function ContactPage() {
  const [content, langRes, saved] = await Promise.all([
    getPageContent("contact"),
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  return (
    <>
      <PageHero content={content} lang={lang} />
      <Contact content={content} lang={lang} />
    </>
  );
}
