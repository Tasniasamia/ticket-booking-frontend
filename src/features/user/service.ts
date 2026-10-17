import { api } from "@/lib/api-client";

// Go backend এর /auth/me। এখানে token লাগে, তাই `api` (Bearer header নিজে বসে), publicApi নয়।
type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };

export const getMeRequest = () => api.get<ApiSuccess<Record<string, unknown>>>("/auth/me");

export const updateMeRequest = (data: Record<string, string>) =>
  api.patch<ApiSuccess<Record<string, unknown>>>("/auth/me", data);
