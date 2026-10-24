"use server";

import { z } from "zod";
import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { DEFAULT_MESSAGES } from "@/lib/i18n/messages";
import type { TranslationDict } from "@/lib/i18n/translate";
import { translationSchema, type TranslationInput } from "./schemas";
import { toTranslation, type Translation } from "./types";
import {
  bulkUpdateTranslationsRequest,
  createTranslationRequest,
  deleteTranslationRequest,
  getTranslationGroupRequest,
  listTranslationsRequest,
  updateTranslationRequest,
} from "./service";

export type TranslationGroupResult = {
  success: boolean;
  message?: string;
  translations?: TranslationDict;
};

export async function getTranslationGroupAction(): Promise<TranslationGroupResult> {
  try {
    const res = await getTranslationGroupRequest();
    return { success: true, translations: res.data.data ?? {} };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type TranslationTableResult = {
  success: boolean;
  message?: string;
  translations?: Translation[];
  meta?: PaginationMeta;
};

export async function getTranslationTableAction(params: TableParams): Promise<TranslationTableResult> {
  try {
    const res = await listTranslationsRequest(toApiParams(params));
    const { docs, ...meta } = res.data.data;
    return { success: true, translations: docs.map(toTranslation), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function deleteTranslationAction(key: string | number): Promise<ActionResult> {
  try {
    await deleteTranslationRequest(String(key));
    return { success: true, message: "Translation deleted." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type TranslationFormResult = ActionResult & {
  fieldErrors?: Record<string, string[] | undefined>;
};

const invalid = (error: z.ZodError): TranslationFormResult => ({
  success: false,
  message: "Please check the form.",
  fieldErrors: z.flattenError(error).fieldErrors,
});

export async function createTranslationAction(input: TranslationInput): Promise<TranslationFormResult> {
  const parsed = translationSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await createTranslationRequest(parsed.data);
    return { success: true, message: "Translation key added." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function updateTranslationAction(
  key: string,
  input: TranslationInput,
): Promise<TranslationFormResult> {
  const parsed = translationSchema.safeParse({ ...input, key });
  if (!parsed.success) return invalid(parsed.error);
  try {
    await updateTranslationRequest(key, parsed.data.values);
    return { success: true, message: "Translation saved." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/** DEFAULT_MESSAGES থেকে backend-এ নেই এমন key গুলো `en` মান সহ যোগ করে */
export async function syncDefaultTranslationsAction(): Promise<ActionResult & { added?: number }> {
  try {
    const existing = (await getTranslationGroupRequest()).data.data ?? {};
    const items = Object.entries(DEFAULT_MESSAGES)
      .filter(([key]) => !(key in existing))
      .map(([key, text]) => ({ key, values: { en: text as string } }));
    if (items.length === 0)
      return { success: true, added: 0, message: "Everything is already in sync." };
    await bulkUpdateTranslationsRequest(items);
    return {
      success: true,
      added: items.length,
      message: `Added ${items.length} new text${items.length === 1 ? "" : "s"}.`,
    };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

const bulkSchema = z
  .array(
    z.object({
      key: z.string().trim().min(1, "Key is required").max(255, "Text is too long"),
      values: z.record(z.string(), z.string()),
    }),
  )
  .min(1, "Nothing to save.")
  .max(200, "Too many rows at once (max 200).");

export type BulkTranslationItem = z.infer<typeof bulkSchema>[number];

/**
 * একসাথে অনেকগুলো key সেভ করে (backend: PUT /translations/bulk)।
 * key থাকলে শুধু পাঠানো ভাষাগুলো merge হয়, না থাকলে নতুন key তৈরি হয়।
 */
export async function bulkSaveTranslationsAction(
  items: BulkTranslationItem[],
): Promise<ActionResult & { saved?: number }> {
  const parsed = bulkSchema.safeParse(items);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid data." };
  try {
    await bulkUpdateTranslationsRequest(parsed.data);
    const n = parsed.data.length;
    return { success: true, saved: n, message: `Saved ${n} text${n === 1 ? "" : "s"}.` };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
