"use server";

import { z } from "zod";
import { getErrorMessage } from "@/features/auth/service";
import type { ActionResult } from "@/components/common/table/data-table";
import { commentSchema, type CommentInput } from "./schemas";
import {
  listCommentsByBlogRequest,
  createCommentRequest,
  updateCommentRequest,
  deleteCommentRequest,
} from "./service";
import { toComment, toCommentTree, type CommentItem } from "./types";

export type CommentsResult = {
  success: boolean;
  message?: string;
  comments?: CommentItem[];
};

export async function getCommentsAction(blogId: number | string): Promise<CommentsResult> {
  try {
    const res = await listCommentsByBlogRequest(blogId);
    return { success: true, comments: toCommentTree(res.data.data) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type CommentFormResult = ActionResult & {
  fieldErrors?: Record<string, string[] | undefined>;
  comment?: CommentItem;
};

export async function createCommentAction(input: CommentInput): Promise<CommentFormResult> {
  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  try {
    const res = await createCommentRequest({
      blog_id: parsed.data.blog_id,
      content: parsed.data.content.trim(),
      parent_id: parsed.data.parent_id ?? null,
    });
    return { success: true, message: "Comment posted.", comment: toComment(res.data.data) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function updateCommentAction(
  id: number | string,
  content: string,
): Promise<CommentFormResult> {
  const trimmed = content.trim();
  if (!trimmed) return { success: false, message: "Comment cannot be empty." };
  try {
    const res = await updateCommentRequest(id, { content: trimmed });
    return { success: true, message: "Comment updated.", comment: toComment(res.data.data) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function deleteCommentAction(id: number | string): Promise<ActionResult> {
  try {
    await deleteCommentRequest(id);
    return { success: true, message: "Comment deleted." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
