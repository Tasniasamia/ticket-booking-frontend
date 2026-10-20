import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";
import type { ConvertResult } from "./types";

// Go backend এর (internal/currency) endpoint। GET আর /convert public, তাই publicApi।
type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type Paginated<T> = { docs: T[]; totalDocs: number; page: number; totalPages: number };

// সব currency আনি (limit এর সর্বোচ্চ ১০০)। enabled বাছাই আর default সবার আগে সাজানো actions.ts এ হয়।
export const getCurrenciesRequest = () =>
  publicApi.get<ApiSuccess<Paginated<Record<string, unknown>>>>("/currencies", {
    params: { limit: 100 },
  });

export const convertRequest = (data: { amount: number; from_code: string; to_code: string }) =>
  publicApi.post<ApiSuccess<ConvertResult>>("/currencies/convert", data);

// Admin table: backend এর page/limit/search/sort_by/sort_dir + filter সব params এ যায়। Response এ docs এর সাথে pagination meta ও আসে।
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

export const listCurrenciesRequest = (params: Record<string, string | number>) =>
  publicApi.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/currencies", { params });

export const deleteCurrencyRequest = (id: string | number) => api.delete<ApiSuccess<unknown>>(`/currencies/${id}`);

// Backend: POST /currencies, PUT /currencies/:id (দুটোতেই login লাগে, তাই api)।
// Update এ code আর is_default বদলানো যায় না (backend UpdateCurrencyRequest এ নেই)।
export type CurrencyPayload = {
  code: string;
  name: string;
  symbol: string;
  rate_to_bdt: number;
  status: string;
  is_default: boolean;
};

export const createCurrencyRequest = (data: CurrencyPayload) => api.post<ApiSuccess<unknown>>("/currencies", data);

export const updateCurrencyRequest = (id: string | number, data: Omit<CurrencyPayload, "code" | "is_default">) =>
  api.put<ApiSuccess<unknown>>(`/currencies/${id}`, data);
