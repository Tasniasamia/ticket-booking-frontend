import { api } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;
type Params = Record<string, string | number>;

export type CheckoutPayload = {
  event_id: number;
  quantity: number;
  payment_method: string;
  customer_name: string;
  customer_email: string;
  customer_phone_number: string;
  customer_address: string;
  country: string;
  postcode: string;
};

/** Backend dto.CheckoutResponse */
export type CheckoutResponse = {
  payment_id: number;
  booking_id: number;
  booking_code: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  checkout_url: string;
  status: string;
};

/**
 * POST /payments/checkout (login লাগে): একসাথে pending booking + pending payment বানায় আর gateway এর checkout_url দেয়।
 */
export const createCheckoutRequest = (data: CheckoutPayload) =>
  api.post<ApiSuccess<CheckoutResponse>>("/payments/checkout", data);

/** Admin: সব booking, pagination + search + status filter */
export const listAllBookingsRequest = (params: Params) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/bookings", { params });

/** User / Manager: নিজের (বা manager এর event এর) booking — backend array দেয় */
export const listMyBookingsRequest = () =>
  api.get<ApiSuccess<Record<string, unknown>[]>>("/bookings/me");

/** Single booking by id */
export const getBookingRequest = (id: number | string) =>
  api.get<ApiSuccess<Record<string, unknown>>>(`/bookings/${id}`);
