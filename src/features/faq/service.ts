import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

export const listPublicFAQsRequest = (params: Record<string, string | number> = {}) =>
  publicApi.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/faqs/public", { params });

export const listAdminFAQsRequest = (params: Record<string, string | number>) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/faqs/admin", { params });

export const createFAQRequest = (data: Record<string, unknown>) =>
  api.post<ApiSuccess<unknown>>("/faqs", data);

export const updateFAQRequest = (id: string | number, data: Record<string, unknown>) =>
  api.put<ApiSuccess<unknown>>(`/faqs/${id}`, data);

export const deleteFAQRequest = (id: string | number) =>
  api.delete<ApiSuccess<unknown>>(`/faqs/${id}`);
