"use server";

import { z } from "zod";
import { getErrorMessage } from "@/features/auth/service";
import { setLanguageCookie } from "@/lib/preferences";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { toLanguage, type Language } from "./types";
import { languageSchema, type LanguageInput } from "./schemas";
import {
  createLanguageRequest,
  deleteLanguageRequest,
  getLanguagesRequest,
  listLanguagesRequest,
  updateLanguageRequest,
} from "./service";

export type LanguageResult = {
  success: boolean;
  message?: string;
  languages?: Language[];
  language?: string;
};

export async function getLanguagesAction(): Promise<LanguageResult> {
  try {
    const res = await getLanguagesRequest();
    const languages = res.data.data.docs
      .map(toLanguage)
      .filter((l) => l.isActive)
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.code.localeCompare(b.code));
    return { success: true, languages };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function setLanguageAction(code: string): Promise<LanguageResult> {
  const list = await getLanguagesAction();
  if (!list.success || !list.languages) return list;
  const found = list.languages.find((l) => l.code === code);
  if (!found) return { success: false, message: "This language is not available." };
  await setLanguageCookie(found.code);
  return { success: true, language: found.code };
}

export type LanguageTableResult = {
  success: boolean;
  message?: string;
  languages?: Language[];
  meta?: PaginationMeta;
};

export async function getLanguageTableAction(params: TableParams): Promise<LanguageTableResult> {
  try {
    const res = await listLanguagesRequest(toApiParams(params));
    const { docs, ...meta } = res.data.data;
    return { success: true, languages: docs.map(toLanguage), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function deleteLanguageAction(id: string | number): Promise<ActionResult> {
  try {
    await deleteLanguageRequest(id);
    return { success: true, message: "Language deleted." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type LanguageFormResult = ActionResult & { fieldErrors?: Record<string, string[] | undefined> };

const invalid = (error: z.ZodError): LanguageFormResult => ({
  success: false,
  message: "Please check the form.",
  fieldErrors: z.flattenError(error).fieldErrors,
});

export async function createLanguageAction(input: LanguageInput): Promise<LanguageFormResult> {
  const parsed = languageSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { name, code, rtl, isActive, isDefault, flag } = parsed.data;
  try {
    await createLanguageRequest({
      name,
      code: code.toLowerCase(),
      rtl,
      is_active: isActive,
      is_default: isDefault,
      flag,
    });
    return { success: true, message: "Language added." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function updateLanguageAction(
  id: string | number,
  input: LanguageInput,
): Promise<LanguageFormResult> {
  const parsed = languageSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { name, rtl, isActive, isDefault, flag } = parsed.data;
  try {
    await updateLanguageRequest(id, {
      name,
      rtl,
      is_active: isActive,
      is_default: isDefault,
      flag,
    });
    return { success: true, message: "Language updated." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}