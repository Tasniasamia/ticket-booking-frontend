import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";
type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

export const createContactRequest = (data: { name: string; email: string; subject: string; message: string }) =>
  publicApi.post<ApiSuccess<unknown>>("/contacts", data);
export const listAdminContactsRequest = (params: Record<string, string | number>) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/contacts/admin", { params });
export const replyContactRequest = (id: string | number, data: { reply_message: string }) =>
  api.post<ApiSuccess<unknown>>(`/contacts/admin/${id}/reply`, data);
