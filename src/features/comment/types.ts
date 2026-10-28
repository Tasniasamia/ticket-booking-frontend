export type CommentUser = {
  id: number;
  name: string;
  email?: string;
  profileImage?: string;
  role?: string;
};

export type CommentItem = {
  id: number;
  blogId: number;
  userId: number;
  parentId: number | null;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: CommentUser | null;
  replies: CommentItem[];
};

type Raw = Record<string, unknown>;
const asObj = (v: unknown): Raw => (v && typeof v === "object" ? (v as Raw) : {});

function toUser(v: unknown): CommentUser | null {
  const o = asObj(v);
  if (!Number(o.id ?? 0)) return null;
  return {
    id: Number(o.id),
    name: String(o.name ?? "User"),
    email: o.email ? String(o.email) : undefined,
    profileImage: o.profile_image ? String(o.profile_image) : undefined,
    role: o.role ? String(o.role) : undefined,
  };
}

export function toComment(d: Raw): CommentItem {
  const repliesRaw = Array.isArray(d.replies) ? d.replies : [];
  return {
    id: Number(d.id ?? 0),
    blogId: Number(d.blog_id ?? 0),
    userId: Number(d.user_id ?? 0),
    parentId: d.parent_id != null ? Number(d.parent_id) : null,
    content: String(d.content ?? ""),
    isDeleted: Boolean(d.is_deleted),
    createdAt: String(d.created_at ?? ""),
    updatedAt: String(d.updated_at ?? ""),
    user: toUser(d.user ?? d.user_info),
    replies: repliesRaw.map((r) => toComment(asObj(r))),
  };
}

export function toCommentTree(list: unknown): CommentItem[] {
  if (!Array.isArray(list)) return [];
  return list.map((x) => toComment(asObj(x)));
}
