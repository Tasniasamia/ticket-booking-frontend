import { api } from "@/lib/api-client";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };

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
 * দাম backend নিজে event থেকে হিসাব করে, client এর পাঠানো দাম বিশ্বাস করে না।
 */
export const createCheckoutRequest = (data: CheckoutPayload) =>
  api.post<ApiSuccess<CheckoutResponse>>("/payments/checkout", data);
