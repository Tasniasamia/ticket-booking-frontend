import { publicApi } from "@/lib/api-client";
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
