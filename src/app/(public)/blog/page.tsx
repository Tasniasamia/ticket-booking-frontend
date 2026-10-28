import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { parseTableParams } from "@/components/common/table/table-params";
import { LocalTime } from "@/components/dashboard/events/local-time";
import { getPublicBlogsAction } from "@/features/blog/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { getPageContent } from "@/features/settings/server";
import type { PageContent } from "@/features/settings/types";
import { pickLanguage, textOf } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";
import { CardPagesSkeleton } from "@/components/skeleton/common-card-skeleton";

export const metadata: Metadata = { title: "Blog | TicketBooking" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const PER_PAGE = 9;

async function BlogContent({
  content,
  searchParams,
}: {
  content?: PageContent;
  searchParams: SearchParams;
}) {
  const [raw, langRes, saved] = await Promise.all([
    searchParams,
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const params = parseTableParams(raw, [], PER_PAGE);
  const res = await getPublicBlogsAction(params, lang);

  return (
    <>
      <PageHero content={content} lang={lang} />
      <Section className="pt-10 sm:pt-12">
        {!res.success && (
          <div className="glass rounded-4xl p-12 text-center">
            <p className="text-lg font-semibold">{res.message ?? "Could not load posts."}</p>
          </div>
        )}
        {res.success && (!res.blogs || res.blogs.length === 0) && (
          <div className="glass rounded-4xl p-12 text-center">
            <p className="text-lg font-semibold">No posts published yet.</p>
          </div>
        )}
        {res.success && res.blogs && res.blogs.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {res.blogs.map((b) => {
                const href = `/blog/${b.id}`;
                return (
                  <Link
                    key={b.id}
                    href={href}
                    className="group overflow-hidden rounded-3xl border border-fg/15 bg-panel/50 transition hover:border-coral/40"
                  >
                    <div className="relative aspect-[16/10] bg-fg/10">
                      {b.thumbnail?.url ? (
                        <Image
                          src={b.thumbnail.url}
                          alt=""
                          fill
                          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                          className="object-cover transition group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-fg/50">
                        {b.author?.name ?? "Team"} ·{" "}
                        <LocalTime iso={b.created_at} format="DD MMM YYYY" />
                      </p>
                      <h2 className="mt-2 line-clamp-2 text-lg font-bold group-hover:text-coral">
                        {textOf(b.title, lang)}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-fg/65">
                        {textOf(b.short_description, lang)}
                      </p>
                      <p className="mt-3 text-xs text-fg/45">
                        {b.like_count} likes · {b.comment_count} comments
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            {res.meta && res.meta.totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {Array.from({ length: res.meta.totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={p === 1 ? "/blog" : `/blog?page=${p}`}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      p === res.meta!.page
                        ? "bg-coral text-white"
                        : "border border-fg/20 hover:bg-fg/10"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const content = await getPageContent("blog");
  return (
    <Suspense fallback={<CardPagesSkeleton/>}>
      <BlogContent content={content} searchParams={searchParams} />
    </Suspense>
  );
}
