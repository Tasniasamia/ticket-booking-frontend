"use server";

import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import {
  verifyStripeSessionRequest,
  verifySslcommerzRequest,
  listAdminPaymentsRequest,
  listManagerPaymentsRequest,
  listUserPaymentsRequest,
  getPaymentRequest,
} from "./service";
import {
  toPaymentItem,
  toPaymentSummary,
  toMoneySummary,
  type PaymentItem,
  type PaymentResultSummary,
  type PaymentSummary,
} from "./types";

export type VerifyResult = { success: boolean; message?: string; payment?: PaymentResultSummary };

/**
 * Result page গুলো (success / failed / cancel) এই একটা action ডাকে।
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

export type PaymentTableResult = {
  success: boolean;
  message?: string;
  payments?: PaymentItem[];
  meta?: PaginationMeta;
  summary?: PaymentSummary;
};

async function mapList(
  fetcher: (params: Record<string, string | number>, lang: string) => Promise<{ data: { data: { docs?: Record<string, unknown>[]; payment?: Record<string, unknown> } & PaginationMeta } }>,
  params: TableParams,
  lang: string,
): Promise<PaymentTableResult> {
  try {
    const res = await fetcher(toApiParams(params), lang);
        console.log("response of getPaymentRequest:", res.data);

    const data = res.data.data;
    const { docs, payment, ...meta } = data;
    return {
      success: true,
      payments: (docs ?? []).map(toPaymentItem),
      meta,
      summary: toMoneySummary(payment),
    };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function getAdminPaymentsAction(params: TableParams, lang = "en"): Promise<PaymentTableResult> {
 
  return mapList(listAdminPaymentsRequest, params, lang);
}

export async function getManagerPaymentsAction(params: TableParams, lang = "en"): Promise<PaymentTableResult> {
  return mapList(listManagerPaymentsRequest, params, lang);
}

export async function getUserPaymentsAction(params: TableParams, lang = "en"): Promise<PaymentTableResult> {
  return mapList(listUserPaymentsRequest, params, lang);
}

export type PaymentDetailResult = {
  success: boolean;
  message?: string;
  payment?: PaymentItem;
};

export async function getPaymentAction(id: number | string): Promise<PaymentDetailResult> {
  try {
    const res = await getPaymentRequest(id);
    return { success: true, payment: toPaymentItem(res.data.data) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
