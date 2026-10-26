/** Admin/manager page এ কোন language এ লেখা দেখাবে: cookie র language, না থাকলে default, না থাকলে "en"। */
export function pickLanguage(
  languages: { code: string; isDefault: boolean }[],
  saved?: string,
): string {
  return (
    languages.find((l) => saved && l.code.toLowerCase() === saved.toLowerCase())?.code ??
    languages.find((l) => l.isDefault)?.code ??
    languages[0]?.code ??
    "en"
  );
}


export const textOf = (r: unknown, lang = "en"): string => {
  if (r == null || r === "") return "—";
  if (typeof r === "string") return r;
  if (typeof r === "object") {
    const o = r as Record<string, unknown>;
    const v = o[lang] ?? o.en ?? Object.values(o)[0];
    return v ? String(v) : "—";
  }
  return String(r);
};


/** { en, bn } থেকে user এর ভাষার লেখা। না পেলে site default → en। কিছুই না থাকলে "" (তখন caller এর default লেখা দেখায়)। */
export function pickLocalized(value: unknown, language: string, defaultLanguage?: string): string {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";
  const o = value as Record<string, unknown>;
  for (const code of [language, defaultLanguage, "en"]) {
    const v = code ? o[code] : undefined;
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}


type Section = Record<string, unknown>;

/** content.hero → { title, subtitle ... }। না থাকলে খালি object। */
export function section(content: Record<string, Section> | undefined, key: string): Section {
  return content?.[key] ?? {};
}

export function listOf(sec: Section, key: string): unknown[] {
  const v = sec[key];
  return Array.isArray(v) ? v : [];
}

/** image field "image1" → image1_url */
export function imageUrl(sec: Section, key: string): string {
  const v = sec[`${key}_url`];
  return typeof v === "string" ? v : "";
}

