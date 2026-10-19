"use client";

import { useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Dropdown } from "./dropdown";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
];

const CURRENCIES = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "BDT", label: "Bangladeshi Taka", symbol: "৳" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
];

const pill = "glass flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition hover:bg-fg/20";
const item = (active: boolean) =>
  cn("flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-fg/10 cursor-pointer", active && "text-coral");

// TODO: select করলে cookie তে save করো (Server Action) আর next-intl locale বদলাও।
export function LanguageSwitcher() {
  const [value, setValue] = useState("en");
  return (
    <Dropdown
      label="Change language"
      className={pill}
      trigger={<><Globe className="size-4" />{value.toUpperCase()}<ChevronDown className="size-3.5 opacity-70" /></>}
    >
      {(close) =>
        LANGUAGES.map((l) => (
          <button key={l.code} role="menuitem" className={item(l.code === value)} onClick={() => { setValue(l.code); close(); }}>
            {l.label}{l.code === value && <Check className="size-4 " />}
          </button>
        ))
      }
    </Dropdown>
  );
}

export function CurrencySwitcher() {
  const [value, setValue] = useState("USD");
  const current = CURRENCIES.find((c) => c.code === value)!;
  return (
    <Dropdown
      label="Change currency"
      className={pill}
      trigger={<><span className="font-semibold text-coral">{current.symbol}</span>{value}<ChevronDown className="size-3.5 opacity-70" /></>}
    >
      {(close) =>
        CURRENCIES.map((c) => (
          <button key={c.code} role="menuitem" className={item(c.code === value)} onClick={() => { setValue(c.code); close(); }}>
            <span><span className="mr-2 inline-block w-4 font-semibold">{c.symbol}</span>{c.code}<span className="ml-2 text-xs text-fg/50">{c.label}</span></span>
            {c.code === value && <Check className="size-4 " />}
          </button>
        ))
      }
    </Dropdown>
  );
}
