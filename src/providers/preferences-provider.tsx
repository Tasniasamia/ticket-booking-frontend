"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { BASE_CURRENCY, FALLBACK_LANGUAGE } from "@/lib/constants";
import { getPreferencesAction } from "@/features/preferences/actions";
import { setLanguageAction } from "@/features/language/actions";
import { setCurrencyAction } from "@/features/currency/actions";
import { convertAmount, formatFallback, formatMoney } from "@/features/currency/utils";
import type { Language } from "@/features/language/types";
import type { Currency } from "@/features/currency/types";

type Status = "loading" | "ready" | "error";
type State = { languages: Language[]; currencies: Currency[]; language: string; currency: string; status: Status };

type PreferencesContext = State & {
  setLanguage: (code: string) => Promise<void>;
  setCurrency: (code: string) => Promise<void>;
  /** amount কে `from` currency থেকে user এর select করা currency তে বদলে সাজিয়ে দেয়। from না দিলে BDT ধরে। */
  formatPrice: (amount: number, from?: string) => string;
};

const Ctx = createContext<PreferencesContext | null>(null);
const initial: State = { languages: [], currencies: [], language: FALLBACK_LANGUAGE, currency: "", status: "loading" };

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initial);

  // user-provider এর মতোই: mount এ একবার Server Action দিয়ে load।
  useEffect(() => {
    let alive = true;
    getPreferencesAction()
      .then((p) => {
        if (!alive) return;
        setState({ languages: p.languages, currencies: p.currencies, language: p.language, currency: p.currency, status: p.success ? "ready" : "error" });
      })
      .catch(() => alive && setState((s) => ({ ...s, status: "error" })));
    return () => {
      alive = false;
    };
  }, []);

  // <html lang dir> বদলায়। rtl আসে backend এর language.rtl থেকে।
  useEffect(() => {
    if (state.status !== "ready") return;
    const lang = state.languages.find((l) => l.code === state.language);
    document.documentElement.lang = state.language;
    document.documentElement.dir = lang?.rtl ? "rtl" : "ltr";
  }, [state.status, state.language, state.languages]);

  const setLanguage = useCallback(async (code: string) => {
    const res = await setLanguageAction(code);
    const next = res.language;
    if (res.success && next) setState((s) => ({ ...s, language: next }));
    else toast.error(res.message ?? "Could not change language.");
  }, []);

  const setCurrency = useCallback(async (code: string) => {
    const res = await setCurrencyAction(code);
    const next = res.currency;
    if (res.success && next) setState((s) => ({ ...s, currency: next }));
    else toast.error(res.message ?? "Could not change currency.");
  }, []);

  const { currencies, currency, language } = state;
  const formatPrice = useCallback(
    (amount: number, from: string = BASE_CURRENCY) => {
      const target = currencies.find((c) => c.code === currency);
      const source = currencies.find((c) => c.code === from.toUpperCase());
      if (!target || !source) return formatFallback(amount, from, language);
      return formatMoney(convertAmount(amount, source, target), target.symbol, language);
    },
    [currencies, currency, language],
  );

  const value = useMemo<PreferencesContext>(() => ({ ...state, setLanguage, setCurrency, formatPrice }), [state, setLanguage, setCurrency, formatPrice]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePreferences() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return ctx;
}
