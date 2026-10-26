import { api, publicApi } from "@/lib/api-client";
import type { SiteSettingsInput } from "./schemas";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };

// GET /settings আর GET /settings/pages/:slug public → publicApi। PUT এ login লাগে → api।
export const getSettingsRequest = () => publicApi.get<ApiSuccess<Record<string, unknown>>>("/settings");

export const upsertSettingsRequest = (data: SiteSettingsInput) => api.put<ApiSuccess<unknown>>("/settings", data);

export const getPageSettingRequest = (slug: string) =>
  publicApi.get<ApiSuccess<{ slug: string; content: unknown }>>(`/settings/pages/${slug}`);

// Backend handler body থেকে slug পড়ে, তাই path এর পাশাপাশি body তেও পাঠাই।
export const upsertPageSettingRequest = (slug: string, content: Record<string, unknown>) =>
  api.put<ApiSuccess<unknown>>(`/settings/pages/${slug}`, { slug, content });

// logo মুছতে media id লাগে, কিন্তু settings এ শুধু URL রাখা হয়। তাই URL দিয়ে media খুঁজি।
export const listMediaRequest = (model_name: string) =>
  api.get<ApiSuccess<{ docs: { id: number; public_url: string }[] }>>("/media", { params: { model_name, limit: 100 } });
