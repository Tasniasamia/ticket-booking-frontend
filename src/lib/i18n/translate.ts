import { DEFAULT_MESSAGES, type MessageKey } from "./messages";

/** Backend GET /translations/group shape: key → { langCode: text } */
export type TranslationDict = Record<string, Record<string, string>>;
export type TranslateValues = Record<string, string | number>;

function interpolate(text: string, values?: TranslateValues) {
  if (!values) return text;
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));
}

/**
 * modify2-style: key is the English text itself.
 * Lookup order: user language → site default → en → DEFAULT_MESSAGES[key] → key.
 */
export function translate(
  dict: TranslationDict,
  key: MessageKey,
  language: string,
  defaultLanguage?: string,
  values?: TranslateValues,
): string {
  const entry = dict[key];
  let text: string | undefined;
  if (entry) {
    for (const code of [language, defaultLanguage, "en"]) {
      const v = code ? entry[code] : undefined;
      if (v && v.trim()) {
        text = v;
        break;
      }
    }
  }
  return interpolate(text ?? DEFAULT_MESSAGES[key] ?? key, values);
}
