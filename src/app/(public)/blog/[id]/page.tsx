import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/shared/section";
import { CommentSection } from "@/components/comments/comment-section";
import { LocalTime } from "@/components/dashboard/events/local-time";
import { getPublicBlogAction } from "@/features/blog/actions";
import { getCommentsAction } from "@/features/comment/actions";
import { toCommentTree } from "@/features/comment/types";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage, textOf } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";

type Props = { params: Promise<{ id: string }> };

/** GET /blogs/:id */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const res = await getPublicBlogAction(id);
  if (!res.blog) return { title: "Blog post" };
  return { title: `${textOf(res.blog.title, lang)} | Blog` };
}

export default async function PublicBlogDetailPage({ params }: Props) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  const res = await getPublicBlogAction(id);
  if (!res.success || !res.blog) notFound();
  const blog = res.blog;

  let comments = toCommentTree(res.comments);
  if (!comments.length) {
    const cRes = await getCommentsAction(blog.id);
    if (cRes.comments) comments = cRes.comments;
  }

  const title = textOf(blog.title, lang);
  const body = textOf(blog.long_description, lang);
  const short = textOf(blog.short_description, lang);

  return (
    <Section className="pt-10 sm:pt-14">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm font-semibold text-coral hover:underline">
          Back to blog
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-fg/60">
          {blog.author?.name ?? "Team"} · <LocalTime iso={blog.created_at} format="DD MMM YYYY" /> ·{" "}
          {blog.like_count} likes · {blog.comment_count} comments
        </p>

        {blog.thumbnail?.url && (
          <div className="glass mt-8 rounded-4xl p-3">
            <div className="relative aspect-video overflow-hidden rounded-3xl">
              <Image src={blog.thumbnail.url} alt="" fill priority sizes="(min-width:768px) 48rem, 95vw" className="object-cover" />
            </div>
          </div>
        )}

        {short && short !== "—" && <p className="mt-8 text-lg font-medium text-fg/75">{short}</p>}
        {body && body !== "—" && (
          <div className="mt-6 whitespace-pre-wrap text-lg leading-8 text-fg/80">{body}</div>
        )}

        {blog.images.length > 0 && (
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {blog.images.map((img) => (
              <li key={img.id} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={img.url} alt="" fill sizes="30vw" className="object-cover" />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-14 border-t border-fg/10 pt-10">
          <CommentSection blogId={blog.id} initialComments={comments} />
        </div>
      </article>
    </Section>
  );
}