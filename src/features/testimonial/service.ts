import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";
type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

export const listPublicTestimonialsRequest = (params: Record<string, string | number> = {}) =>
  publicApi.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/testimonials/public", { params });
export const listAdminTestimonialsRequest = (params: Record<string, string | number>) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/testimonials/admin", { params });
export const createTestimonialRequest = (data: Record<string, unknown>) =>
  api.post<ApiSuccess<unknown>>("/testimonials", data);
export const updateTestimonialRequest = (id: string | number, data: Record<string, unknown>) =>
  api.put<ApiSuccess<unknown>>(`/testimonials/${id}`, data);
export const deleteTestimonialRequest = (id: string | number) =>
  api.delete<ApiSuccess<unknown>>(`/testimonials/${id}`);
