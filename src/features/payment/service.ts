import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
type Raw = Record<string, unknown>;
type Params = Record<string, string | number>;

export type ApiPaginatedWithPayment<T> = {
  docs: T[];
  payment?: { pending: number; paid: number; total: number; currency: string };
} & PaginationMeta;

/** Stripe success URL এ ?session_id=... থাকে। */
export const verifyStripeSessionRequest = (sessionId: string) =>
  publicApi.get<ApiSuccess<Raw>>("/payments/verify-session", { params: { session_id: sessionId } });

/** SSLCommerz এর URL এ ?tran_id=... থাকে। status = SUCCESS | FAILED | CANCELLED */
export const verifySslcommerzRequest = (tranId: string, status: string) =>
  publicApi.get<ApiSuccess<Raw>>("/payments/verify-sslcommerz", {
    params: { tran_id: tranId, status },
  });

/** Admin: GET /payments/admin */
export const listAdminPaymentsRequest = (params: Params, lang: string) =>
  api.get<ApiSuccess<ApiPaginatedWithPayment<Raw>>>("/payments/admin", {
    params: { ...params, lang },
  });

/** Manager: GET /payments/manager */
export const listManagerPaymentsRequest = (params: Params, lang: string) =>
  api.get<ApiSuccess<ApiPaginatedWithPayment<Raw>>>("/payments/manager", {
    params: { ...params, lang },
  });

/** User: GET /payments/user */
export const listUserPaymentsRequest = (params: Params, lang: string) =>
  api.get<ApiSuccess<ApiPaginatedWithPayment<Raw>>>("/payments/user", {
    params: { ...params, lang },
  });

/** Single payment */
export const getPaymentRequest = (id: number | string) =>
  api.get<ApiSuccess<Raw>>(`/payments/${id}`);
