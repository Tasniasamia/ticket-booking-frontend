import type { Metadata } from "next";
import { Contact } from "@/components/home/contact";
import { PageHero } from "@/components/shared/page-hero";
import { T } from "@/components/shared/t";
import { getPageContent } from "@/features/settings/server";
import { Suspense } from "react";
import { PageContent } from "@/features/settings/types";
import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import { pickLanguage } from "@/lib/localized";

export const metadata: Metadata = { title: "Contact | TicketBooking" };

export async function ContactContent({ content }: { content?: PageContent }) {
const [langRes, saved] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  return (
    <>
      <PageHero content={content} lang={lang}/>
      <Contact content={content} lang={lang}/>
    </>
  );
}



export default async function ContactPage() {
  const content = await getPageContent("contact");

  return (
      <Suspense
          fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}
        > 
            <ContactContent content={content} />

        </Suspense>
  )
  
}
