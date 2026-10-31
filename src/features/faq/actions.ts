"use server";

import { z } from "zod";
import { getToken } from "@/lib/session";
import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { faqSchema, type FAQInput } from "./schemas";
import { toFAQ, type FAQ } from "./types";
import {
  createFAQRequest,
  deleteFAQRequest,
  listAdminFAQsRequest,
  listPublicFAQsRequest,
  updateFAQRequest,
} from "./service";

export type FAQTableResult = {
  success: boolean;
  message?: string;
  faqs?: FAQ[];
  meta?: PaginationMeta;
};

export async function getPublicFAQsAction(limit = 50): Promise<FAQTableResult> {
  try {
    const res = await listPublicFAQsRequest({ page: 1, limit });
    const data = res.data.data;
    return {
      success: true,
      faqs: (data.docs ?? []).map((d) => toFAQ(d as Record<string, unknown>)),
      meta: data as PaginationMeta,
    };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), faqs: [] };
  }
}

export async function getFAQTableAction(params: TableParams): Promise<FAQTableResult> {
  if (!(await getToken())) return { success: false, message: "Please log in.", faqs: [] };
  try {
    const res = await listAdminFAQsRequest(toApiParams(params));
    const data = res.data.data;
    return {
      success: true,
      faqs: (data.docs ?? []).map((d) => toFAQ(d as Record<string, unknown>)),
      meta: data as PaginationMeta,
    };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), faqs: [] };
  }
}

export async function createFAQAction(input: FAQInput): Promise<ActionResult> {
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please check the form.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  if (!(await getToken())) return { success: false, message: "Please log in." };
  try {
    const res = await createFAQRequest(parsed.data);
    return { success: true, message: res.data.message ?? "FAQ created." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function updateFAQAction(id: number, input: Partial<FAQInput>): Promise<ActionResult> {
  const parsed = faqSchema.partial().safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please check the form.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  if (!(await getToken())) return { success: false, message: "Please log in." };
  try {
    const res = await updateFAQRequest(id, parsed.data);
    return { success: true, message: res.data.message ?? "FAQ updated." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function deleteFAQAction(id: number): Promise<ActionResult> {
  if (!(await getToken())) return { success: false, message: "Please log in." };
  try {
    const res = await deleteFAQRequest(id);
    return { success: true, message: res.data.message ?? "FAQ deleted." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
