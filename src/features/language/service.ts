import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type Paginated<T> = { docs: T[]; totalDocs: number; page: number; totalPages: number };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

export const getLanguagesRequest = () =>
  publicApi.get<ApiSuccess<Paginated<Record<string, unknown>>>>("/languages", {
    params: { limit: 100 },
  });

export const getDefaultLanguageRequest = () =>
  publicApi.get<ApiSuccess<Record<string, unknown>>>("/languages/default");

export const listLanguagesRequest = (params: Record<string, string | number>) =>
  publicApi.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/languages", { params });

export type LanguagePayload = {
  name: string;
  code: string;
  rtl: boolean;
  is_active: boolean;
  is_default: boolean;
  flag: string;
};

export const createLanguageRequest = (data: LanguagePayload) =>
  api.post<ApiSuccess<unknown>>("/languages", data);

export const updateLanguageRequest = (id: string | number, data: Omit<LanguagePayload, "code">) =>
  api.put<ApiSuccess<unknown>>(`/languages/${id}`, data);

export const deleteLanguageRequest = (id: string | number) =>
  api.delete<ApiSuccess<unknown>>(`/languages/${id}`);