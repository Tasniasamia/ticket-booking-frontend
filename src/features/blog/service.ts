import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;
type Params = Record<string, string | number>;
type Raw = Record<string, unknown>;

/** Admin: সব blog (status filter + search)। lang শুধু search এর জন্য; response সব language। */
export const listAdminBlogsRequest = (params: Params, lang: string) =>
  api.get<ApiSuccess<ApiPaginated<Raw>>>("/blogs/admin", { params: { ...params, lang } });

/** Public: শুধু approved (backend filter)। Response এখনও Raw multi-lang object। */
export const listPublicBlogsRequest = (params: Params, lang: string) =>
  publicApi.get<ApiSuccess<ApiPaginated<Raw>>>("/blogs/public", { params: { ...params, lang } });

/** Author এর নিজের blogs */
export const listMyBlogsRequest = (params: Params, lang: string) =>
  api.get<ApiSuccess<ApiPaginated<Raw>>>("/blogs/myBlogs", { params: { ...params, lang } });

/** Public/auth detail by id — comments tree সহ */
export const getBlogRequest = (id: string | number) =>
  publicApi.get<ApiSuccess<Raw>>(`/blogs/${id}`);

export const getAdminBlogRequest = (id: string | number) =>
  api.get<ApiSuccess<Raw>>(`/blogs/admin/${id}`);

export type BlogPayload = {
  title: Record<string, string>;
  short_description: Record<string, string>;
  long_description: Record<string, string>;
  thumbnail_image: { id: number; url: string };
  images: { id: number; url: string }[];
  status?: string;
  slug?: string;
};

export const createBlogRequest = (data: BlogPayload) => api.post<ApiSuccess<Raw>>("/blogs", data);

export const updateBlogRequest = (id: number, data: Partial<BlogPayload>) =>
  api.put<ApiSuccess<Raw>>(`/blogs/${id}`, data);

export const deleteBlogRequest = (id: string | number) =>
  api.delete<ApiSuccess<unknown>>(`/blogs/${id}`);

export const updateBlogStatusRequest = (blogId: number, status: string) =>
  api.patch<ApiSuccess<unknown>>("/blogs/admin/updateStatus", { blogId, status });

export const toggleBlogLikeRequest = (id: number | string) =>
  api.post<ApiSuccess<{ liked: boolean; like_count: number }>>(`/blogs/${id}/like`);
