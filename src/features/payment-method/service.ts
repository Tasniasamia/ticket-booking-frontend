// import { api } from "@/lib/api-client";
// import type { PaginationMeta } from "@/components/common/table/table-params";

// type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
// export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

// export type PaymentMethodPayload = {
//   name: string;
//   code: string;
//   logo_url: string;
//   logo_id: number;
//   enable: boolean;
//   credentials: Record<string, string>;
// };

// // GET /payment-methods/admin: admin only। credentials ও decrypt হয়ে আসে, তাই api (token সহ)।
// export const listPaymentMethodsRequest = (params: Record<string, string | number>) =>
//   api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/payment-methods/admin", { params });

// export const createPaymentMethodRequest = (data: PaymentMethodPayload) => api.post<ApiSuccess<unknown>>("/payment-methods", data);

// // Backend UpdatePaymentMethodRequest এ credentials "required", তাই সবসময় পুরো payload পাঠাই।
// export const updatePaymentMethodRequest = (id: string | number, data: PaymentMethodPayload) =>
//   api.put<ApiSuccess<unknown>>(`/payment-methods/${id}`, data);

// export const deletePaymentMethodRequest = (id: string | number) => api.delete<ApiSuccess<unknown>>(`/payment-methods/${id}`);

import { api, publicApi } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;

export type PaymentMethodPayload = {
  name: string;
  code: string;
  logo_url: string;
  logo_id: number;
  enable: boolean;
  credentials: Record<string, string>;
};

// GET /payment-methods/admin: admin only। credentials ও decrypt হয়ে আসে, তাই api (token সহ)।
export const listPaymentMethodsRequest = (params: Record<string, string | number>) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/payment-methods/admin", { params });

export const createPaymentMethodRequest = (data: PaymentMethodPayload) => api.post<ApiSuccess<unknown>>("/payment-methods", data);

// Backend UpdatePaymentMethodRequest এ credentials "required", তাই সবসময় পুরো payload পাঠাই।
export const updatePaymentMethodRequest = (id: string | number, data: PaymentMethodPayload) =>
  api.put<ApiSuccess<unknown>>(`/payment-methods/${id}`, data);

export const deletePaymentMethodRequest = (id: string | number) => api.delete<ApiSuccess<unknown>>(`/payment-methods/${id}`);

// GET /payment-methods: public, শুধু enabled গুলো। booking এর সময় user এখান থেকে বাছে।
export const listPublicPaymentMethodsRequest = () =>
  publicApi.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/payment-methods", { params: { limit: 100 } });
