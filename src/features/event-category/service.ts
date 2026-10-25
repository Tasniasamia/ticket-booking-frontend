import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type Paginated<T> = { docs: T[]; totalDocs: number; page: number; totalPages: number };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

// Public list (website এর জন্য): lang দিলে ওই language এর string আসে।
export const getEventCategoriesRequest = (lang: string) =>
  publicApi.get<ApiSuccess<Paginated<Record<string, unknown>>>>("/event-categories", {
    params: { limit: 100, lang },
  });

// Admin table: page/limit/search/sort_by/sort_dir + filter সব params এ যায়।
// lang দিলে backend ওই language এর string পাঠায় (search ও ওই language এ হয়)।
export const listEventCategoriesRequest = (params: Record<string, string | number>, lang: string) =>
  publicApi.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/event-categories", {
    params: { ...params, lang },
  });

// Edit এর জন্য: lang ইচ্ছে করে পাঠানো হয় না, তাই সব language এর data আসে।
export const getEventCategoryByIdRequest = (id: string | number) =>
  publicApi.get<ApiSuccess<Record<string, unknown>>>(`/event-categories/${id}`);

export const deleteEventCategoryRequest = (id: string | number) =>
  api.delete<ApiSuccess<unknown>>(`/event-categories/${id}`);

// Backend: POST /event-categories, PUT /event-categories/:id (দুটোতেই login লাগে, তাই api)।
export type EventCategoryPayload = {
  name: Record<string, string>;
  description: Record<string, string>;
  event_category_image_url: string;
  event_category_image_id: number;
};

export const createEventCategoryRequest = (data: EventCategoryPayload) =>
  api.post<ApiSuccess<unknown>>("/event-categories", data);

export const updateEventCategoryRequest = (id: string | number, data: EventCategoryPayload) =>
  api.put<ApiSuccess<unknown>>(`/event-categories/${id}`, data);