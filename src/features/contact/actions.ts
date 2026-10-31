"use server";
import { z } from "zod";
import { getToken } from "@/lib/session";
import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { contactSchema, replySchema, type ContactInput } from "./schemas";
import { toContact, type Contact } from "./types";
import { createContactRequest, listAdminContactsRequest, replyContactRequest } from "./service";

export type ContactTableResult = {
  success: boolean; message?: string; contacts?: Contact[]; meta?: PaginationMeta;
};

export async function submitContactAction(input: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please check the form." };
  try {
    const res = await createContactRequest(parsed.data);
    return { success: true, message: res.data.message ?? "Message sent." };
  } catch (err) { return { success: false, message: getErrorMessage(err) }; }
}

export async function getContactTableAction(params: TableParams): Promise<ContactTableResult> {
  if (!(await getToken())) return { success: false, message: "Please log in.", contacts: [] };
  try {
    const res = await listAdminContactsRequest(toApiParams(params));
    const data = res.data.data;
    return { success: true, contacts: (data.docs ?? []).map((d) => toContact(d as Record<string, unknown>)), meta: data as PaginationMeta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), contacts: [] };
  }
}

export async function replyContactAction(id: number, input: { reply_message: string }): Promise<ActionResult> {
  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please check the form."};
  if (!(await getToken())) return { success: false, message: "Please log in." };
  try {
    const res = await replyContactRequest(id, parsed.data);
    return { success: true, message: res.data.message ?? "Reply sent." };
  } catch (err) { return { success: false, message: getErrorMessage(err) }; }
}
