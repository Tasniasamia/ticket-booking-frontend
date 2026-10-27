import { publicApi } from "@/lib/api-client";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
type Raw = Record<string, unknown>;

/** Stripe success URL এ ?session_id=... থাকে। Backend Stripe কে জিজ্ঞেস করে payment আর booking confirm করে। */
export const verifyStripeSessionRequest = (sessionId: string) =>
  publicApi.get<ApiSuccess<Raw>>("/payments/verify-session", { params: { session_id: sessionId } });

/** SSLCommerz এর URL এ ?tran_id=... থাকে। status = SUCCESS | FAILED | CANCELLED */
export const verifySslcommerzRequest = (tranId: string, status: string) =>
  publicApi.get<ApiSuccess<Raw>>("/payments/verify-sslcommerz", { params: { tran_id: tranId, status } });
