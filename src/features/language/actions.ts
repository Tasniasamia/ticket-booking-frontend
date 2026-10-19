"use server";

import { getErrorMessage } from "@/features/auth/service";
import { setLanguageCookie } from "@/lib/preferences";
import { toLanguage, type Language } from "./types";
import { getLanguagesRequest } from "./service";

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
      .filter((l) => l.isActive) // inactive language user কে দেখাই না
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.code.localeCompare(b.code)); // default সবার আগে
    return { success: true, languages };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/**
 * User এর পছন্দ cookie তে বসায়। code client থেকে আসে, তাই আগে backend এর active list এর সাথে মিলিয়ে নিই।
 * (Backend এর POST /languages/set-default এখানে ডাকি না: সেটা সবার জন্য site default বদলায়।)
 */
export async function setLanguageAction(code: string): Promise<LanguageResult> {
  const list = await getLanguagesAction();
  if (!list.success || !list.languages) return list;
  const found = list.languages.find((l) => l.code === code);
  if (!found) return { success: false, message: "This language is not available." };
  await setLanguageCookie(found.code);
  return { success: true, language: found.code };
}
