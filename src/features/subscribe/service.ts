import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";
type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

export const createSubscribeRequest = (data: { email: string }) =>
  publicApi.post<ApiSuccess<unknown>>("/subscribers", data);
export const listAdminSubscribersRequest = (params: Record<string, string | number>) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/subscribers/admin", { params });
