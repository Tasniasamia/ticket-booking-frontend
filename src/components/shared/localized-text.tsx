"use client";

import { useCallback } from "react";
import { usePreferences } from "@/providers/preferences-provider";
import { pickLocalized } from "@/lib/localized";
import type { MessageKey } from "@/lib/i18n/messages";

/**
 * Admin এর Page settings এ লেখা text দেখায় (user এর ভাষায়)।
 * কিছু লেখা না থাকলে আগের মতো `fallback` key এর অনুবাদ দেখায়, তাই settings খালি থাকলেও site ভাঙে না।
 */
export function LText({ value, fallback }: { value?: unknown; fallback?: MessageKey }) {
  const l = useL();
  return <>{l(value, fallback)}</>;
}

/** Attribute বা string এ লাগলে: const l = useL(); l(value, "Find events") */
export function useL() {
  const { language, languages, t } = usePreferences();
  const defaultLanguage = languages.find((x) => x.isDefault)?.code;
  return useCallback(
    (value?: unknown, fallback?: MessageKey) => pickLocalized(value, language, defaultLanguage) || (fallback ? t(fallback) : ""),
    [language, defaultLanguage, t],
  );
}
