import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

export const getMeRequest = () => api.get<ApiSuccess<Record<string, unknown>>>("/auth/me");
export const updateMeRequest = (data: Record<string, unknown>) =>
  api.patch<ApiSuccess<Record<string, unknown>>>("/auth/me", data);
export const listUsersRequest = (params: Record<string, string | number>) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/auth/all", { params });
export const listManagersAdminRequest = (params: Record<string, string | number>) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/auth/all/managers", { params });
export const listPublicManagersRequest = (params: Record<string, string | number> = {}) =>
  publicApi.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/auth/managers/public", { params });
export const getPublicManagerRequest = (id: string | number) =>
  publicApi.get<ApiSuccess<Record<string, unknown>>>(`/auth/managers/public/${id}`);
export const updateMemberRequest = (id: string | number, data: Record<string, unknown>) =>
  api.patch<ApiSuccess<Record<string, unknown>>>(`/auth/members/${id}`, data);
export const deleteUserRequest = (id: string | number) =>
  api.delete<ApiSuccess<unknown>>(`/auth/${id}`);
