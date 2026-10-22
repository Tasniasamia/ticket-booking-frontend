"use server";

import { FALLBACK_LANGUAGE } from "@/lib/constants";
import { getCurrencyCookie, getLanguageCookie } from "@/lib/preferences";
import { getCurrenciesAction } from "@/features/currency/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { getTranslationGroupAction } from "@/features/translation/actions";
import type { TranslationDict } from "@/lib/i18n/translate";
import type { Currency } from "@/features/currency/types";
import type { Language } from "@/features/language/types";

export type PreferencesResult = {
  success: boolean;
  message?: string;
  languages: Language[];
  currencies: Currency[];
  language: string; // এখন যেটা select করা
  currency: string;
  /** key → { langCode: লেখা }। না এলে (backend বন্ধ) {} থাকে, তখন code এর English default দেখায়। */
  translations: TranslationDict;
};

/**
 * Provider এটা একবার ডাকে। দুটো list একসাথে আনে, আর cookie র পছন্দ এখনো valid কিনা দেখে।
 * Cookie না থাকলে (বা admin সেই language/currency disable করে দিলে) backend এর default ব্যবহার হয়।
 * Static লেখার অনুবাদ (translations) ও একই request এ আসে, যাতে ভাষা আর লেখা একসাথে বদলায়।
 */
export async function getPreferencesAction(): Promise<PreferencesResult> {
  const [langs, curs, langCookie, curCookie, trans] = await Promise.all([
    getLanguagesAction(), getCurrenciesAction(), getLanguageCookie(), getCurrencyCookie(), getTranslationGroupAction(),
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
    // translation আনা ব্যর্থ হলেও site চলে (English default দিয়ে), তাই success এ ধরি না
    translations: trans.translations ?? {},
  };
}
