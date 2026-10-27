"use server";

import { getErrorMessage } from "@/features/auth/service";
import { toPaymentSummary, type PaymentSummary } from "./types";
import { verifySslcommerzRequest, verifyStripeSessionRequest } from "./service";

export type VerifyResult = { success: boolean; message?: string; payment?: PaymentSummary };

/**
 * Result page গুলো (success / failed / cancel) এই একটা action ডাকে।
 * - session_id থাকলে Stripe
 * - tran_id থাকলে SSLCommerz (status ঠিক করে page এর path: success → SUCCESS, failed → FAILED, cancel → CANCELLED)
 * - কোনোটাই না থাকলে (Stripe cancel এ এমন হয়) backend ডাকা হয় না।
 */
export async function verifyPaymentAction(q: {
  sessionId?: string;
  tranId?: string;
  status: "SUCCESS" | "FAILED" | "CANCELLED";
}): Promise<VerifyResult> {
  try {
    if (q.sessionId) {
      const res = await verifyStripeSessionRequest(q.sessionId);
      return { success: true, payment: toPaymentSummary(res.data.data) };
    }
    if (q.tranId) {
      const res = await verifySslcommerzRequest(q.tranId, q.status);
      return { success: true, payment: toPaymentSummary(res.data.data) };
    }
    return { success: false, message: "No payment reference found." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
