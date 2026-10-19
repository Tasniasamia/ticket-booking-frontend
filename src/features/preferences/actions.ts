"use server";

import { FALLBACK_LANGUAGE } from "@/lib/constants";
import { getCurrencyCookie, getLanguageCookie } from "@/lib/preferences";
import { getCurrenciesAction } from "@/features/currency/actions";
import { getLanguagesAction } from "@/features/language/actions";
import type { Currency } from "@/features/currency/types";
import type { Language } from "@/features/language/types";

export type PreferencesResult = {
  success: boolean;
  message?: string;
  languages: Language[];
  currencies: Currency[];
  language: string; // এখন যেটা select করা
  currency: string;
};

/**
 * Provider এটা একবার ডাকে। দুটো list একসাথে আনে, আর cookie র পছন্দ এখনো valid কিনা দেখে।
 * Cookie না থাকলে (বা admin সেই language/currency disable করে দিলে) backend এর default ব্যবহার হয়।
 */
export async function getPreferencesAction(): Promise<PreferencesResult> {
  const [langs, curs, langCookie, curCookie] = await Promise.all([
    getLanguagesAction(), getCurrenciesAction(), getLanguageCookie(), getCurrencyCookie(),
  ]);
  const languages = langs.languages ?? [];
  const currencies = curs.currencies ?? [];

  const pick = <T extends { code: string; isDefault: boolean }>(list: T[], saved?: string) =>
    list.find((x) => saved && x.code.toLowerCase() === saved.toLowerCase()) ??
    list.find((x) => x.isDefault) ?? list[0];

  return {
    success: langs.success && curs.success,
    message: langs.message ?? curs.message,
    languages,
    currencies,
    language: pick(languages, langCookie)?.code ?? FALLBACK_LANGUAGE,
    currency: pick(currencies, curCookie)?.code ?? "",
  };
}
