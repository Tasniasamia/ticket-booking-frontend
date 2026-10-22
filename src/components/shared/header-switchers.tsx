"use client";

import { useTransition } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Dropdown } from "./dropdown";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/providers/preferences-provider";

const pill = "glass flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition hover:bg-fg/20";
const item = (active: boolean) =>
  cn("flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-fg/10 cursor-pointer disabled:opacity-60", active && "text-coral");

// /languages আর /currencies এর উত্তর আসা পর্যন্ত placeholder। backend বন্ধ থাকলে (list খালি) switcher লুকিয়ে রাখি।
const Placeholder = () => <div aria-hidden className="h-10 w-20 animate-pulse rounded-full bg-fg/10" />;

export function LanguageSwitcher() {
  const { languages, language, status, setLanguage, t } = usePreferences();
  const [pending, startTransition] = useTransition();
  if (status === "loading") return <Placeholder />;
  if (languages.length === 0) return null;

  return (
    <Dropdown
      label={t("Change language")}
      className={cn(pill, pending && "opacity-60")}
      trigger={<><Globe className="size-4" />{language.toUpperCase()}<ChevronDown className="size-3.5 opacity-70" /></>}
    >
      {(close) =>
        languages.map((l) => (
          <button
            key={l.code}
            disabled={pending}
            className={item(l.code === language)}
            onClick={() => { close(); startTransition(() => setLanguage(l.code)); }}
          >
            {l.name}{l.code === language && <Check className="size-4 " />}
          </button>
        ))
      }
    </Dropdown>
  );
}

export function CurrencySwitcher() {
  const { currencies, currency, status, setCurrency, t } = usePreferences();
  const [pending, startTransition] = useTransition();
  if (status === "loading") return <Placeholder />;
  const current = currencies.find((c) => c.code === currency);
  if (!current) return null;

  return (
    <Dropdown
      label={t("Change currency")}
      className={cn(pill, pending && "opacity-60")}
      trigger={<><span className="font-semibold text-coral">{current.symbol}</span>{current.code}<ChevronDown className="size-3.5 opacity-70" /></>}
    >
      {(close) =>
        currencies.map((c) => (
          <button
            key={c.code}
         
            disabled={pending}
            className={item(c.code === currency)}
            onClick={() => { close(); startTransition(() => setCurrency(c.code)); }}
          >
            <span><span className="mr-2 inline-block w-4 font-semibold">{c.symbol}</span>{c.code}<span className="ml-2 text-xs text-fg/50">{c.name}</span></span>
            {c.code === currency && <Check className="size-4 " />}
          </button>
        ))
      }
    </Dropdown>
  );
}
