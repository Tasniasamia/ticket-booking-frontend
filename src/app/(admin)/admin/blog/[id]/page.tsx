import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { CommentSection } from "@/components/comments/comment-section";
import { BlogStatusSelect } from "@/components/dashboard/admin/blog/blog-status-select";
import { LocalTime } from "@/components/dashboard/events/local-time";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getAdminBlogAction } from "@/features/blog/actions";
import { getCommentsAction } from "@/features/comment/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage, textOf } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";

type Props = { params: Promise<{ id: string }> };

/** GET /blogs/admin/:id */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getAdminBlogAction(id);
  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  return { title: res.blog ? `Blog #${id}: ${textOf(res.blog.title, lang)}` : "Blog detail" };
}

export default async function AdminBlogDetailPage({ params }: Props) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const [langRes, saved, res, cRes] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
    getAdminBlogAction(id),
    getCommentsAction(id),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  if (!res.success || !res.blog) notFound();
  const blog = res.blog;
  const comments = cRes.comments ?? [];

  const title = textOf(blog.title, lang);
  const short = textOf(blog.short_description, lang);
  const body = textOf(blog.long_description, lang);

  return (
    <div className="space-y-8">
      <PageHeader
        title={title !== "—" ? title : `Blog #${blog.id}`}
        subtitle={`ID ${blog.id}${blog.slug ? ` · /${blog.slug}` : ""}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-1.5 rounded-full border border-fg/20 px-4 py-2 text-sm font-medium hover:bg-fg/10"
            >
              <ArrowLeft className="size-4" /> Back to list
            </Link>
            {blog.status === "approved" && (
              <Link
                href={`/blog/${blog.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full border border-fg/20 px-4 py-2 text-sm font-medium hover:bg-fg/10"
              >
                <ExternalLink className="size-4" /> Public view
              </Link>
            )}
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-fg/15 bg-panel/40 px-5 py-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-fg/50">Status</span>
          <BlogStatusSelect blogId={blog.id} status={blog.status} />
        </div>
        <span className="text-fg/30">|</span>
        <span>
          <span className="text-fg/50">Author </span>
          {blog.author?.name ?? "—"}
          {blog.author?.email ? <span className="text-fg/45"> ({blog.author.email})</span> : null}
        </span>
        <span className="text-fg/30">|</span>
        <span>
          <span className="text-fg/50">Created </span>
          <LocalTime iso={blog.created_at} format="DD MMM YYYY, hh:mm A" />
        </span>
        <span className="text-fg/30">|</span>
        <span className="text-fg/70">
          {blog.like_count} likes · {blog.comment_count} comments
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          {blog.thumbnail?.url && (
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-fg/10">
              <Image src={blog.thumbnail.url} alt="" fill className="object-cover" sizes="(min-width:1024px) 60vw, 95vw" />
            </div>
          )}
          {short && short !== "—" && <p className="text-base font-medium text-fg/75">{short}</p>}
          {body && body !== "—" && (
            <div className="whitespace-pre-wrap leading-relaxed text-fg/80">{body}</div>
          )}
          {blog.images.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg/60">Gallery</h3>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {blog.images.map((img) => (
                  <li key={img.id} className="relative aspect-square overflow-hidden rounded-xl border border-fg/10">
                    <Image src={img.url} alt="" fill className="object-cover" sizes="200px" />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* <div className="rounded-2xl border border-fg/10 bg-panel/30 p-4">
            <h3 className="mb-2 text-sm font-semibold text-fg/60">All languages</h3>
            <dl className="space-y-2 text-sm">
              {Object.entries(blog.title).map(([code, text]) => (
                <div key={code} className="grid grid-cols-[3rem_1fr] gap-2">
                  <dt className="uppercase text-fg/45">{code}</dt>
                  <dd>{text || "—"}</dd>
                </div>
              ))}
            </dl>
          </div> */}
        </div>

        {/* <aside>
          <div className="rounded-2xl border border-fg/15 bg-panel/40 p-4 text-sm">
            <h3 className="font-semibold">Quick info</h3>
            <ul className="mt-3 space-y-2 text-fg/70">
              <li>ID: {blog.id}</li>
              <li>Slug: {blog.slug || "—"}</li>
              <li>Author ID: {blog.author_id}</li>
              <li>
                Updated: <LocalTime iso={blog.updated_at} format="DD MMM YYYY" />
              </li>
            </ul>
          </div>
        </aside> */}
      </div>

      <div className="rounded-2xl border border-fg/15 bg-panel/40 p-6">
        <CommentSection blogId={blog.id} initialComments={comments} allowAdminDelete />
      </div>
    </div>
  );
}