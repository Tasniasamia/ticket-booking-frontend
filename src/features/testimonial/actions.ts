"use server";
import { z } from "zod";
import { getToken } from "@/lib/session";
import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { testimonialSchema, type TestimonialInput } from "./schemas";
import { toTestimonial, type Testimonial } from "./types";
import {
  createTestimonialRequest, deleteTestimonialRequest,
  listAdminTestimonialsRequest, listPublicTestimonialsRequest, updateTestimonialRequest,
} from "./service";

export type TestimonialTableResult = {
  success: boolean; message?: string; testimonials?: Testimonial[]; meta?: PaginationMeta;
};
export async function getPublicTestimonialsAction(
  limitOrParams: number | TableParams = 20,
): Promise<TestimonialTableResult> {
  try {
    const params =
      typeof limitOrParams === "number"
        ? { page: 1, limit: limitOrParams }
        : toApiParams(limitOrParams);
    const res = await listPublicTestimonialsRequest(params);
    const data = res.data.data;
    return {
      success: true,
      testimonials: (data.docs ?? []).map((d) => toTestimonial(d as Record<string, unknown>)),
      meta: data as PaginationMeta,
    };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), testimonials: [] };
  }
}



export async function getTestimonialTableAction(params: TableParams): Promise<TestimonialTableResult> {
  if (!(await getToken())) return { success: false, message: "Please log in.", testimonials: [] };
  try {
    const res = await listAdminTestimonialsRequest(toApiParams(params));
    const data = res.data.data;
    return { success: true, testimonials: (data.docs ?? []).map((d) => toTestimonial(d as Record<string, unknown>)), meta: data as PaginationMeta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), testimonials: [] };
  }
}

export async function createTestimonialAction(input: TestimonialInput): Promise<ActionResult> {
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please check the form."};
  if (!(await getToken())) return { success: false, message: "Please log in." };
  try {
    const res = await createTestimonialRequest(parsed.data);
    return { success: true, message: res.data.message ?? "Testimonial created." };
  } catch (err) { return { success: false, message: getErrorMessage(err) }; }
}

export async function updateTestimonialAction(id: number, input: Partial<TestimonialInput>): Promise<ActionResult> {
  const parsed = testimonialSchema.partial().safeParse(input);
  if (!parsed.success) return { success: false, message: "Please check the form." };
  if (!(await getToken())) return { success: false, message: "Please log in." };
  try {
    const res = await updateTestimonialRequest(id, parsed.data);
    return { success: true, message: res.data.message ?? "Testimonial updated." };
  } catch (err) { return { success: false, message: getErrorMessage(err) }; }
}

export async function deleteTestimonialAction(id: number | string): Promise<ActionResult> {
  if (!(await getToken())) return { success: false, message: "Please log in." };
  try {
    const res = await deleteTestimonialRequest(id);
    return { success: true, message: res.data.message ?? "Testimonial deleted." };
  } catch (err) { return { success: false, message: getErrorMessage(err) }; }
}
