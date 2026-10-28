"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { MessageCircle, Reply, Trash2, Send } from "lucide-react";
import { LocalTime } from "@/components/dashboard/events/local-time";
import {
  createCommentAction,
  deleteCommentAction,
  getCommentsAction,
} from "@/features/comment/actions";
import type { CommentItem } from "@/features/comment/types";
import { useUser } from "@/providers/user-provider";
import Link from "next/link";

type Props = {
  blogId: number;
  /** Optional initial tree (from blog detail) */
  initialComments?: CommentItem[];
  /** Admin can delete any; owner can delete own */
  allowAdminDelete?: boolean;
  className?: string;
};

function Avatar({ name, image }: { name: string; image?: string }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt="" className="size-9 rounded-full object-cover" />
    );
  }
  const letter = (name || "?").charAt(0).toUpperCase();
  return (
    <span className="grid size-9 place-items-center rounded-full bg-fg/15 text-sm font-bold">
      {letter}
    </span>
  );
}

function CommentNode({
  comment,
  blogId,
  depth,
  currentUserId,
  isAdmin,
  onChanged,
}: {
  comment: CommentItem;
  blogId: number;
  depth: number;
  currentUserId?: number;
  isAdmin?: boolean;
  onChanged: () => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const canDelete =
    isAdmin || (currentUserId != null && currentUserId === comment.userId);

  const submitReply = () => {
    if (!text.trim()) return;
    start(async () => {
      const res = await createCommentAction({
        blog_id: blogId,
        content: text,
        parent_id: comment.id,
      });
      if (res.success) {
        setText("");
        setReplyOpen(false);
        onChanged();
      }
    });
  };

  const onDelete = () => {
    start(async () => {
      await deleteCommentAction(comment.id);
      onChanged();
    });
  };

  return (
    <div className={depth > 0 ? "ml-6 border-l border-fg/10 pl-4 sm:ml-10" : ""}>
      <div className="flex gap-3 py-3">
        <Avatar name={comment.user?.name ?? "User"} image={comment.user?.profileImage} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-semibold">{comment.user?.name ?? "User"}</span>
            <span className="text-xs text-fg/45">
              <LocalTime iso={comment.createdAt} format="DD MMM YYYY, hh:mm A" />
            </span>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-fg/85">
            {comment.isDeleted ? (
              <em className="text-fg/40">Comment deleted</em>
            ) : (
              comment.content
            )}
          </p>
          {!comment.isDeleted && (
            <div className="mt-2 flex items-center gap-3 text-xs">
              {currentUserId != null && depth < 4 && (
                <button
                  type="button"
                  onClick={() => setReplyOpen((v) => !v)}
                  className="inline-flex items-center gap-1 text-fg/60 hover:text-coral"
                >
                  <Reply className="size-3.5" /> Reply
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={onDelete}
                  className="inline-flex items-center gap-1 text-fg/50 hover:text-rose-400"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              )}
            </div>
          )}
          {replyOpen && (
            <div className="mt-3 flex gap-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
                placeholder="Write a reply..."
                className="flex-1 rounded-xl border border-fg/15 bg-panel/40 px-3 py-2 text-sm outline-none focus:border-coral/50"
              />
              <button
                type="button"
                disabled={pending || !text.trim()}
                onClick={submitReply}
                className="self-end rounded-xl bg-coral px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((r) => (
        <CommentNode
          key={r.id}
          comment={r}
          blogId={blogId}
          depth={depth + 1}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onChanged={onChanged}
        />
      ))}
    </div>
  );
}

/**
 * Reusable nested comment section for public blog + admin views.
 */
export function CommentSection({
  blogId,
  initialComments,
  allowAdminDelete = false,
  className,
}: Props) {
  const { user, status } = useUser();
  const [comments, setComments] = useState<CommentItem[]>(initialComments ?? []);
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    start(async () => {
      const res = await getCommentsAction(blogId);
      if (res.success && res.comments) setComments(res.comments);
    });
  }, [blogId]);

  useEffect(() => {
    if (!initialComments) refresh();
  }, [initialComments, refresh]);

  const submit = () => {
    if (!text.trim()) return;
    setError(null);
    start(async () => {
      const res = await createCommentAction({ blog_id: blogId, content: text });
      if (res.success) {
        setText("");
        refresh();
      } else {
        setError(res.message ?? "Could not post comment.");
      }
    });
  };

  const isAdmin = allowAdminDelete || user?.role === "admin";

  return (
    <section className={className}>
      <h3 className="flex items-center gap-2 text-lg font-bold">
        <MessageCircle className="size-5 text-coral" />
        Comments
        <span className="text-sm font-normal text-fg/50">({comments.length})</span>
      </h3>

      {status === "authenticated" && user ? (
        <div className="mt-4 flex gap-3">
          <Avatar name={user.name} image={user.profile_image} />
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Share your thoughts..."
              className="w-full rounded-xl border border-fg/15 bg-panel/40 px-3 py-2 text-sm outline-none focus:border-coral/50"
            />
            {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
            <button
              type="button"
              disabled={pending || !text.trim()}
              onClick={submit}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-coral px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Send className="size-4" /> Post comment
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-fg/20 bg-panel/30 px-4 py-3 text-sm text-fg/60">
          <Link href="/login" className="font-semibold text-coral hover:underline">
            Sign in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      <div className="mt-6 divide-y divide-fg/10">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-fg/50">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => (
            <CommentNode
              key={c.id}
              comment={c}
              blogId={blogId}
              depth={0}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              onChanged={refresh}
            />
          ))
        )}
      </div>
    </section>
  );
}
