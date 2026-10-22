"use client";

import { useT } from "@/providers/preferences-provider";
import type { MessageKey } from "@/lib/i18n/messages";
import type { TranslateValues } from "@/lib/i18n/translate";

export function T({ k, values }: { k: MessageKey; values?: TranslateValues }) {
  return <>{useT()(k, values)}</>;
}