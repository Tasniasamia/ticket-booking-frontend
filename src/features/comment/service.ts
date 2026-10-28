import { api, publicApi } from "@/lib/api-client";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
type Raw = Record<string, unknown>;

export const listCommentsByBlogRequest = (blogId: number | string) =>
  publicApi.get<ApiSuccess<Raw[]>>(`/comments/blog/${blogId}`);

export const createCommentRequest = (data: { blog_id: number; content: string; parent_id?: number | null }) =>
  api.post<ApiSuccess<Raw>>("/comments", data);

export const updateCommentRequest = (id: number | string, data: { content: string }) =>
  api.put<ApiSuccess<Raw>>(`/comments/${id}`, data);

export const deleteCommentRequest = (id: number | string) =>
  api.delete<ApiSuccess<unknown>>(`/comments/${id}`);
