import { z } from "zod";

export const commentSchema = z.object({
  blog_id: z.number().int().positive(),
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment is too long"),
  parent_id: z.number().int().positive().nullable().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;
