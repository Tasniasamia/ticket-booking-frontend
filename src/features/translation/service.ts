import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

export const getTranslationGroupRequest = () =>
  publicApi.get<ApiSuccess<Record<string, Record<string, string>>>>("/translations/group");

export const listTranslationsRequest = (params: Record<string, string | number>) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/translations", { params });

export const createTranslationRequest = (data: { key: string; values: Record<string, string> }) =>
  api.post<ApiSuccess<unknown>>("/translations", data);

export const updateTranslationRequest = (key: string, values: Record<string, string>) =>
  api.put<ApiSuccess<unknown>>(`/translations/${encodeURIComponent(key)}`, { values });

export const deleteTranslationRequest = (key: string) =>
  api.delete<ApiSuccess<unknown>>(`/translations/${encodeURIComponent(key)}`);

export const bulkUpdateTranslationsRequest = (
  items: { key: string; values: Record<string, string> }[],
) => api.put<ApiSuccess<unknown>>("/translations/bulk", { items });