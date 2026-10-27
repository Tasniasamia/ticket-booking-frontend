// "use server";

// import { z } from "zod";
// import { getErrorMessage } from "@/features/auth/service";
// import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
// import type { ActionResult } from "@/components/common/table/data-table";
// import { toPaymentMethod, rowsToCredentials, type PaymentMethod } from "./types";
// import { paymentMethodSchema, type PaymentMethodInput } from "./schemas";
// import { createPaymentMethodRequest, deletePaymentMethodRequest, listPaymentMethodsRequest, updatePaymentMethodRequest } from "./service";

// export type PaymentMethodTableResult = {
//   success: boolean;
//   message?: string;
//   paymentMethods?: PaymentMethod[];
//   meta?: PaginationMeta;
// };

// /** Admin table: enabled/disabled দুটোই (backend এর /payment-methods/admin) */
// export async function getPaymentMethodTableAction(params: TableParams): Promise<PaymentMethodTableResult> {
//   try {
//     const res = await listPaymentMethodsRequest(toApiParams(params));
//     const { docs, ...meta } = res.data.data;
//     return { success: true, paymentMethods: docs.map(toPaymentMethod), meta };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }

// export async function deletePaymentMethodAction(id: string | number): Promise<ActionResult> {
//   try {
//     await deletePaymentMethodRequest(id);
//     return { success: true, message: "Payment method deleted." };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }

// export type PaymentMethodFormResult = ActionResult & { fieldErrors?: Record<string, string[] | undefined> };

// const invalid = (error: z.ZodError): PaymentMethodFormResult => ({
//   success: false,
//   message: "Please check the form.",
//   fieldErrors: z.flattenError(error).fieldErrors,
// });

// function toPayload(v: PaymentMethodInput) {
//   return { name: v.name, code: v.code, logo_url: v.logo_url, logo_id: v.logo_id, enable: v.enable, credentials: rowsToCredentials(v.credentials) };
// }

// export async function createPaymentMethodAction(input: PaymentMethodInput): Promise<PaymentMethodFormResult> {
//   const parsed = paymentMethodSchema.safeParse(input);
//   if (!parsed.success) return invalid(parsed.error);
//   try {
//     await createPaymentMethodRequest(toPayload(parsed.data));
//     return { success: true, message: "Payment method created." };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }

// export async function updatePaymentMethodAction(id: string | number, input: PaymentMethodInput): Promise<PaymentMethodFormResult> {
//   const parsed = paymentMethodSchema.safeParse(input);
//   if (!parsed.success) return invalid(parsed.error);
//   try {
//     await updatePaymentMethodRequest(id, toPayload(parsed.data));
//     return { success: true, message: "Payment method updated." };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }


"use server";

import { z } from "zod";
import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { CHECKOUT_CODES, toPaymentMethod, toPublicPaymentMethod, rowsToCredentials, type PaymentMethod, type PublicPaymentMethod } from "./types";
import { paymentMethodSchema, type PaymentMethodInput } from "./schemas";
import { createPaymentMethodRequest, deletePaymentMethodRequest, listPaymentMethodsRequest, listPublicPaymentMethodsRequest, updatePaymentMethodRequest } from "./service";

export type PaymentMethodTableResult = {
  success: boolean;
  message?: string;
  paymentMethods?: PaymentMethod[];
  meta?: PaginationMeta;
};

/** Admin table: enabled/disabled দুটোই (backend এর /payment-methods/admin) */
export async function getPaymentMethodTableAction(params: TableParams): Promise<PaymentMethodTableResult> {
  try {
    const res = await listPaymentMethodsRequest(toApiParams(params));
    const { docs, ...meta } = res.data.data;
    return { success: true, paymentMethods: docs.map(toPaymentMethod), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function deletePaymentMethodAction(id: string | number): Promise<ActionResult> {
  try {
    await deletePaymentMethodRequest(id);
    return { success: true, message: "Payment method deleted." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type PaymentMethodFormResult = ActionResult & { fieldErrors?: Record<string, string[] | undefined> };

const invalid = (error: z.ZodError): PaymentMethodFormResult => ({
  success: false,
  message: "Please check the form.",
  fieldErrors: z.flattenError(error).fieldErrors,
});

function toPayload(v: PaymentMethodInput) {
  return { name: v.name, code: v.code, logo_url: v.logo_url, logo_id: v.logo_id, enable: v.enable, credentials: rowsToCredentials(v.credentials) };
}

export async function createPaymentMethodAction(input: PaymentMethodInput): Promise<PaymentMethodFormResult> {
  const parsed = paymentMethodSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await createPaymentMethodRequest(toPayload(parsed.data));
    return { success: true, message: "Payment method created." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function updatePaymentMethodAction(id: string | number, input: PaymentMethodInput): Promise<PaymentMethodFormResult> {
  const parsed = paymentMethodSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await updatePaymentMethodRequest(id, toPayload(parsed.data));
    return { success: true, message: "Payment method updated." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/** Booking panel এর জন্য: enabled আর checkout সমর্থিত method, credentials ছাড়া। */
export async function getPaymentMethodsAction(): Promise<{ success: boolean; message?: string; methods: PublicPaymentMethod[] }> {
  try {
    const res = await listPublicPaymentMethodsRequest();
    const methods = res.data.data.docs
      .filter((d) => d.enable !== false)
      .map(toPublicPaymentMethod)
      .filter((m) => CHECKOUT_CODES.includes(m.code));
    return { success: true, methods };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), methods: [] };
  }
}
