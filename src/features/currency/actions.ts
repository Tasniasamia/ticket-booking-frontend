"use server";

import { getErrorMessage } from "@/features/auth/service";
import { setCurrencyCookie } from "@/lib/preferences";
import { toCurrency, type Currency } from "./types";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { z } from "zod";
import { currencySchema, type CurrencyInput } from "./schemas";
import { convertRequest, createCurrencyRequest, deleteCurrencyRequest, updateCurrencyRequest, getCurrenciesRequest, listCurrenciesRequest } from "./service";

export type CurrencyResult = {
  success: boolean;
  message?: string;
  currencies?: Currency[];
  currency?: string;
  result?: number;
};

export async function getCurrenciesAction(): Promise<CurrencyResult> {
  try {
    const res = await getCurrenciesRequest();
    const currencies = res.data.data.docs
      .map(toCurrency)
      .filter((c) => c.status === "enable") // disable করা currency user কে দেখাই না
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.code.localeCompare(b.code)); // default সবার আগে
    return { success: true, currencies };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/**
 * User এর পছন্দ cookie তে বসায়। code client থেকে আসে, তাই backend এর enabled list এর সাথে মিলিয়ে নিই।
 * (Backend এর POST /currencies/set-default এখানে ডাকি না: সেটা সবার জন্য site default বদলায়।)
 */
export async function setCurrencyAction(code: string): Promise<CurrencyResult> {
  const list = await getCurrenciesAction();
  if (!list.success || !list.currencies) return list;
  const found = list.currencies.find((c) => c.code === code.toUpperCase());
  if (!found) return { success: false, message: "This currency is not available." };
  await setCurrencyCookie(found.code);
  return { success: true, currency: found.code };
}

/**
 * Backend এর POST /currencies/convert। UI তে দাম দেখানোর জন্য লাগে না (client এ হিসাব হয)।
 * Checkout/payment এর মতো যেখানে server এর rate ই চূড়ান্ত, সেখানে এটা ব্যবহার করুন।
 */
export async function convertAction(input: { amount: number; from: string; to: string }): Promise<CurrencyResult> {
  if (!(input.amount > 0)) return { success: false, message: "Amount must be greater than 0." };
  try {
    const res = await convertRequest({ amount: input.amount, from_code: input.from, to_code: input.to });
    return { success: true, result: res.data.data.result };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type CurrencyTableResult = {
  success: boolean;
  message?: string;
  currencies?: Currency[];
  meta?: PaginationMeta;
};

/** Admin table এর জন্য: disabled সহ সব currency, backend এর pagination/search/filter/sort সহ। */
export async function getCurrencyTableAction(params: TableParams): Promise<CurrencyTableResult> {
  try {
    const res = await listCurrenciesRequest(toApiParams(params));
    const { docs, ...meta } = res.data.data;
    return { success: true, currencies: docs.map(toCurrency), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/** Table এর delete button এ বসে। DataTable এই ActionResult নিয়েই toast দেখায়। */
export async function deleteCurrencyAction(id: string | number): Promise<ActionResult> {
  try {
    await deleteCurrencyRequest(id);
    return { success: true, message: "Currency deleted." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type CurrencyFormResult = ActionResult & { fieldErrors?: Record<string, string[] | undefined> };

const invalid = (error: z.ZodError): CurrencyFormResult => ({
  success: false,
  message: "Please check the form.",
  fieldErrors: z.flattenError(error).fieldErrors,
});

export async function createCurrencyAction(input: CurrencyInput): Promise<CurrencyFormResult> {
  const parsed = currencySchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { code, name, symbol, rateToBDT, status, isDefault } = parsed.data;
  try {
    await createCurrencyRequest({ code: code.toUpperCase(), name, symbol, rate_to_bdt: rateToBDT, status, is_default: isDefault });
    return { success: true, message: "Currency created." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function updateCurrencyAction(id: string | number, input: CurrencyInput): Promise<CurrencyFormResult> {
  const parsed = currencySchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { name, symbol, rateToBDT, status } = parsed.data;
  try {
    await updateCurrencyRequest(id, { name, symbol, rate_to_bdt: rateToBDT, status });
    return { success: true, message: "Currency updated." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
