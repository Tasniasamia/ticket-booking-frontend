import { publicApi } from "@/lib/api-client";

// Go backend এর (internal/language) endpoint। GET গুলো public, তাই publicApi।
type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type Paginated<T> = { docs: T[]; totalDocs: number; page: number; totalPages: number };

// সব language আনি। active বাছাই আর default সবার আগে সাজানো actions.ts এ হয়।
export const getLanguagesRequest = () =>
  publicApi.get<ApiSuccess<Paginated<Record<string, unknown>>>>("/languages", {
    params: { limit: 100 },
  });

export const getDefaultLanguageRequest = () =>
  publicApi.get<ApiSuccess<Record<string, unknown>>>("/languages/default");
