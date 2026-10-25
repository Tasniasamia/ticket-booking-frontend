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