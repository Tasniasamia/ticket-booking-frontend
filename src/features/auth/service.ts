import axios from "axios";
import { publicApi } from "@/lib/api-client";
import type { RegisterInput } from "./schemas";

// Go backend এর (internal/user) endpoint গুলো। সব token ছাড়া চলে, তাই publicApi।
export type OtpReason = "register" | "reset_password";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type LoginData = {
  id: number; name: string; email: string; created_at: string;
  is_verified: boolean; token: string; role: string;
};

export async function loginRequest(data: { email: string; password: string }) {
  const res = await publicApi.post<ApiSuccess<LoginData>>("/auth/login", data);
  const d = res.data;
  // backend "Bearer " সহ পাঠালেও সমস্যা নেই, header বসানোর সময় আমরা নিজে "Bearer " যোগ করি।
  return { ...d, token: String(d.data.token ?? "").replace(/^Bearer\s+/i, "") };
}

export const registerRequest = (data: Pick<RegisterInput, "name" | "email" | "password" | "role">) =>
  publicApi.post("/auth/register", data);

export const verifyOtpRequest = (data: { email: string; otp: string; reason: OtpReason }) =>
  publicApi.post("/auth/verify-otp", data);

export const resendOtpRequest = (data: { email: string; reason: OtpReason }) =>
  publicApi.post("/auth/resend-otp", data);

export const forgotPasswordRequest = (email: string) => publicApi.post("/auth/forgot-password", { email });

export const resetPasswordRequest = (data: { email: string; otp: string; new_password: string }) =>
  publicApi.post("/auth/reset-password", data);

/** Backend error shape: { errorMessage, errorDetails } */
export function getErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    if (!err.response) return "Could not reach the server. Try again.";
    const d = err.response.data;
    return d?.errorMessage ?? d?.message ?? "Request failed. Try again.";
  }
  return "Something went wrong. Try again.";
}
