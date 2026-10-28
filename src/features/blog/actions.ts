"use server";

import { z } from "zod";
import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { toBlog, type BlogItem, type BlogStatus } from "./types";
import { blogSchema, type BlogFormValues } from "./schemas";
import {
  createBlogRequest,
  deleteBlogRequest,
  getAdminBlogRequest,
  getBlogRequest,
  listAdminBlogsRequest,
  listMyBlogsRequest,
  listPublicBlogsRequest,
  toggleBlogLikeRequest,
  updateBlogRequest,
  updateBlogStatusRequest,
  type BlogPayload,
} from "./service";

export type BlogTableResult = {
  success: boolean;
  message?: string;
  blogs?: BlogItem[];
  meta?: PaginationMeta;
};

export async function getAdminBlogsAction(params: TableParams, lang: string): Promise<BlogTableResult> {
  try {
    const res = await listAdminBlogsRequest(toApiParams(params), lang);
    const { docs, ...meta } = res.data.data;
    return { success: true, blogs: (docs ?? []).map(toBlog), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function getPublicBlogsAction(params: TableParams, lang: string): Promise<BlogTableResult> {
  try {
    const res = await listPublicBlogsRequest(toApiParams(params), lang);
    const { docs, ...meta } = res.data.data;
    return { success: true, blogs: (docs ?? []).map(toBlog), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function getMyBlogsAction(params: TableParams, lang: string): Promise<BlogTableResult> {
  try {
    const res = await listMyBlogsRequest(toApiParams(params), lang);
    const { docs, ...meta } = res.data.data;
    return { success: true, blogs: (docs ?? []).map(toBlog), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type BlogDetailResult = {
  success: boolean;
  message?: string;
  blog?: BlogItem;
  comments?: unknown;
};

export async function getPublicBlogAction(id: string | number): Promise<BlogDetailResult> {
  try {
    const res = await getBlogRequest(id);
    const d = res.data.data;
    return { success: true, blog: toBlog(d), comments: d.comments };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function getAdminBlogAction(id: string | number): Promise<BlogDetailResult> {
  try {
    const res = await getAdminBlogRequest(id);
    return { success: true, blog: toBlog(res.data.data) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type BlogFormResult = ActionResult & { fieldErrors?: Record<string, string[] | undefined> };

const invalid = (error: z.ZodError): BlogFormResult => ({
  success: false,
  message: "Please check the form.",
  fieldErrors: z.flattenError(error).fieldErrors,
});

const clean = (r: Record<string, string>) =>
  Object.fromEntries(Object.entries(r).filter(([, v]) => v.trim() !== ""));

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const toPayload = (v: BlogFormValues): BlogPayload => {
  const title = clean(v.title);
  const slug =
    (v.slug && v.slug.trim()) ||
    slugify(title.en || title.bn || Object.values(title)[0] || "post");
  return {
    title,
    short_description: clean(v.short_description),
    long_description: clean(v.long_description),
    thumbnail_image: { id: v.thumbnail_id, url: v.thumbnail_url },
    images: v.images,
    slug,
  };
};

export async function createBlogAction(input: BlogFormValues): Promise<BlogFormResult> {
  const parsed = blogSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await createBlogRequest(toPayload(parsed.data));
    return { success: true, message: "Blog submitted. It will show publicly once approved." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function updateBlogAction(id: number, input: BlogFormValues): Promise<BlogFormResult> {
  const parsed = blogSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await updateBlogRequest(id, toPayload(parsed.data));
    return { success: true, message: "Blog updated." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function deleteBlogAction(id: string | number): Promise<ActionResult> {
  try {
    await deleteBlogRequest(id);
    return { success: true, message: "Blog deleted." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function updateBlogStatusAction(blogId: number, status: BlogStatus): Promise<ActionResult> {
  try {
    await updateBlogStatusRequest(blogId, status);
    return { success: true, message: `Blog ${status}.` };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type LikeResult = ActionResult & { liked?: boolean; likeCount?: number };

export async function toggleBlogLikeAction(id: number | string): Promise<LikeResult> {
  try {
    const res = await toggleBlogLikeRequest(id);
    return { success: true, liked: res.data.data.liked, likeCount: res.data.data.like_count };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
