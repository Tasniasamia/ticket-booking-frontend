"use server";

import { z } from "zod";
import { getErrorMessage } from "@/features/auth/service";
import { bookingSchema, type BookingInput } from "./schemas";
import { createCheckoutRequest } from "./service";

export type CheckoutResult = {
  success: boolean;
  message?: string;
  /** Stripe / SSLCommerz এর payment page। client এখানে redirect করবে। */
  checkoutUrl?: string;
  bookingCode?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createCheckoutAction(input: BookingInput): Promise<CheckoutResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please check the form.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  try {
    const res = await createCheckoutRequest(parsed.data);
    const d = res.data.data;
    if (!d.checkout_url) return { success: false, message: "Could not start the payment. Please try again." };
    return { success: true, checkoutUrl: d.checkout_url, bookingCode: d.booking_code };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
