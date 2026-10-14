import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/shared/section";
import { BLOGS } from "@/lib/mock-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = BLOGS.find((x) => x.slug === slug);
  return { title: b ? `${b.title} | TicketBooking` : "Post not found" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOGS.find((b) => b.slug === slug);
  if (!post) notFound();

  return (
    <Section className="pt-10 sm:pt-14">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm font-semibold text-coral hover:underline">Back to blog</Link>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-fg/60">{post.author} · {post.date} · {post.read} read</p>
        <div className="glass mt-8 rounded-4xl p-3">
          <div className="relative aspect-video overflow-hidden rounded-3xl">
            <Image src={post.image} alt="" fill priority sizes="(min-width:768px) 48rem, 95vw" className="object-cover" />
          </div>
        </div>
        <div className="mt-10 space-y-5 text-lg leading-8 text-fg/80">
          {post.body.map((p) => <p key={p}>{p}</p>)}
        </div>
        {/* TODO: likes + comments (features/blog) */}
      </article>
    </Section>
  );
}
