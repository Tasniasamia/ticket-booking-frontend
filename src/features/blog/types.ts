/** Backend blog/dto.RawResponse — title ইত্যাদি সব language object ({ en, bn }) */

type Raw = Record<string, unknown>;

export type Localized = Record<string, string>;

export type BlogStatus = "pending" | "approved" | "canceled";
export const BLOG_STATUSES: BlogStatus[] = ["pending", "approved", "canceled"];

export type BlogImage = { id: number; url: string };

export type BlogAuthor = {
  id: number;
  name: string;
  email: string;
  role: string;
  profileImage: string;
};

export type BlogItem = {
  id: number;
  title: Localized;
  short_description: Localized;
  long_description: Localized;
  status: BlogStatus;
  slug: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
  author_id: number;
  author: BlogAuthor | null;
  thumbnail: BlogImage | null;
  images: BlogImage[];
};

const toLocalized = (v: unknown): Localized =>
  v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v as Raw).map(([k, x]) => [k, String(x ?? "")]))
    : {};

const toImage = (v: unknown): BlogImage | null => {
  if (!v || typeof v !== "object") return null;
  const o = v as Raw;
  const url = String(o.url ?? "");
  return url ? { id: Number(o.id ?? 0), url } : null;
};

const toStatus = (v: unknown): BlogStatus =>
  BLOG_STATUSES.includes(v as BlogStatus) ? (v as BlogStatus) : "pending";

export function toBlog(d: Raw): BlogItem {
  const author = d.author as Raw | null | undefined;
  return {
    id: Number(d.id),
    title: toLocalized(d.title),
    short_description: toLocalized(d.short_description),
    long_description: toLocalized(d.long_description),
    status: toStatus(d.status),
    slug: String(d.slug ?? ""),
    like_count: Number(d.like_count ?? 0),
    comment_count: Number(d.comment_count ?? 0),
    is_liked: Boolean(d.is_liked),
    created_at: String(d.created_at ?? ""),
    updated_at: String(d.updated_at ?? ""),
    author_id: Number(d.author_id ?? 0),
    author: author
      ? {
          id: Number(author.id),
          name: String(author.name ?? ""),
          email: String(author.email ?? ""),
          role: String(author.role ?? ""),
          profileImage: String(author.profile_image ?? ""),
        }
      : null,
    thumbnail: toImage(d.thumbnail_image),
    images: Array.isArray(d.images)
      ? (d.images.map(toImage).filter(Boolean) as BlogImage[])
      : [],
  };
}
