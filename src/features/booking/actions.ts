"use server";

import { z } from "zod";
import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import { bookingSchema, type BookingInput } from "./schemas";
import { createCheckoutRequest, listAllBookingsRequest, listMyBookingsRequest, getBookingRequest } from "./service";
import { toBooking, type BookingItem } from "./types";

export type CheckoutResult = {
  success: boolean;
  message?: string;
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

export type BookingTableResult = {
  success: boolean;
  message?: string;
  bookings?: BookingItem[];
  meta?: PaginationMeta;
};

/** Admin: paginated list */
export async function getAdminBookingsAction(params: TableParams): Promise<BookingTableResult> {
  try {
    const res = await listAllBookingsRequest(toApiParams(params));
    const { docs, ...meta } = res.data.data;
    return { success: true, bookings: (docs ?? []).map(toBooking), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/**
 * User / Manager: /bookings/me — backend currently returns a plain array.
 * We wrap it as a single-page meta so DataTable still works.
 */
export async function getMyBookingsAction(): Promise<BookingTableResult> {
  try {
    const res = await listMyBookingsRequest();
    const list = Array.isArray(res.data.data) ? res.data.data : [];
    const bookings = list.map(toBooking);
    const meta: PaginationMeta = {
      totalDocs: bookings.length,
      page: 1,
      limit: Math.max(bookings.length, 10),
      totalPages: 1,
      hasPrevPage: false,
      hasNextPage: false,
    };
    return { success: true, bookings, meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type BookingDetailResult = {
  success: boolean;
  message?: string;
  booking?: BookingItem;
};

export async function getBookingAction(id: number | string): Promise<BookingDetailResult> {
  try {
    const res = await getBookingRequest(id);
    return { success: true, booking: toBooking(res.data.data as Record<string, unknown>) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
