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
