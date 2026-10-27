"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/providers/preferences-provider";
import type { MessageKey } from "@/lib/i18n/messages";
import { useUrlParams } from "./use-url-params";

export type BarFilter = {
  /** URL / backend query key, যেমন "category_id" */
  key: string;
  /** group এর aria-label (অনুবাদ হয়) */
  label: MessageKey;
  /** options এর লেখা আগেই user এর ভাষায় আসে (backend থেকে) */
  options: { value: string; label: string }[];
};

type Props = {
  /** অনুবাদ হয়, তাই MessageKey */
  placeholder: MessageKey;
  filters?: BarFilter[];
  className?: string;
};

/**
 * যেকোনো list page এর search + filter। কোনো data নিজে আনে না, শুধু URL বদলায়,
 * page (Server Component) সেই URL পড়ে backend এ ?search=&category_id=&page= পাঠায়।
 * filter গুলো chip হিসেবে দেখায় ("All" chip নিজে থেকেই আসে)।
 */
export function SearchFilterBar({ placeholder, filters = [], className }: Props) {
  const t = useT();
  const { sp, update } = useUrlParams();
  const urlSearch = sp.get("search") ?? "";
  const [text, setText] = useState(urlSearch);
  const [seen, setSeen] = useState(urlSearch);

  // URL বাইরে থেকে বদলালে (যেমন "Clear filters") input মিলিয়ে নিই। render এর সময়ই, effect ছাড়া।
  if (seen !== urlSearch) {
    setSeen(urlSearch);
    if (text.trim() !== urlSearch) setText(urlSearch);
  }

  // টাইপ থামার ৪০০ms পর search হয়
  useEffect(() => {
    if (text.trim() === urlSearch) return;
    const id = setTimeout(() => update({ search: text.trim() }), 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className={cn("flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", className)}>
      <label className="glass flex max-w-md flex-1 items-center gap-3 rounded-full px-5 py-3">
        <Search className="size-5 shrink-0 text-fg/55" />
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t(placeholder)}
          aria-label={t(placeholder)}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg/45"
        />
      </label>

      {filters.map((f) => {
        const current = sp.get(f.key) ?? "";
        const chip = (active: boolean) =>
          cn("cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition", active ? "btn-grad" : "glass hover:bg-fg/10");
        return (
          <div key={f.key} className="flex flex-wrap gap-2" role="group" aria-label={t(f.label)}>
            <button type="button" aria-pressed={!current} onClick={() => update({ [f.key]: undefined })} className={chip(!current)}>
              {t("All")}
            </button>
            {f.options.map((o) => (
              <button key={o.value} type="button" aria-pressed={current === o.value} onClick={() => update({ [f.key]: o.value })} className={chip(current === o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
