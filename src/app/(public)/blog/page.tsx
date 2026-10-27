import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { BLOGS } from "@/lib/mock-data";
import { pickLanguage } from "@/lib/localized";
import { getPageContent } from "@/features/settings/server";
import { PageContent } from "@/features/settings/types";
import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import { Suspense } from "react";
import { BlogSkeleton } from "@/components/skeleton/blog-skeleton";

export const metadata: Metadata = { title: "Blog | TicketBooking" };

export async function BlogContent({ content }: { content?: PageContent }) {
const [langRes, saved] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const [first, ...rest] = BLOGS;
  return (
    <>
      <PageHero content={content} lang={lang}/>
      <Section className="pt-10 sm:pt-12">
        <Link href={`/blog/${first.slug}`} className="glass group grid overflow-hidden rounded-4xl p-3 md:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-3xl md:aspect-auto md:min-h-80">
            <Image src={first.image} alt="" fill priority sizes="(min-width:768px) 45vw, 95vw" className="object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <span className="text-sm font-semibold text-coral">{first.category}</span>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{first.title}</h2>
            <p className="mt-3 leading-relaxed text-fg/65">{first.excerpt}</p>
            <p className="mt-5 text-sm text-fg/55">{first.author} · {first.date} · {first.read} read</p>
          </div>
        </Link>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {rest.map((b) => (
            <Link key={b.slug} href={`/blog/${b.slug}`} className="glass group rounded-4xl p-3">
              <div className="relative aspect-video overflow-hidden rounded-3xl">
                <Image src={b.image} alt="" fill sizes="(min-width:768px) 30vw, 95vw" className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <span className="text-sm font-semibold text-coral">{b.category}</span>
                <h3 className="mt-1 line-clamp-2 text-lg font-bold">{b.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-fg/65">{b.excerpt}</p>
                <p className="mt-4 text-xs text-fg/55">{b.date} · {b.read} read</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}



export default async function BlogPage() {
  const content = await getPageContent("blog");

  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogContent content={content} />
    </Suspense>
  )
  
}