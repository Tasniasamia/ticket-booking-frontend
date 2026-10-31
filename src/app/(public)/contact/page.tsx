import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { T } from "@/components/shared/t";
import { getPageContent } from "@/features/settings/server";
import { Suspense } from "react";
import { PageContent } from "@/features/settings/types";
import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import { pickLanguage } from "@/lib/localized";
import { ContactSkeleton } from "@/components/skeleton/contact-skeleton";
import { Contact } from "@/components/home/contact";

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
          fallback={<ContactSkeleton/>}
        > 
            <ContactContent content={content} />

        </Suspense>
  )
  
}
