"use client";

import { Search } from "lucide-react";
import { useT } from "@/providers/preferences-provider";

/** Hero এর search form। placeholder/aria-label অনুবাদ করতে হয় বলে এটা client component। */
export function HeroSearch() {
  const t = useT();
  return (
    <form action="/events" className="glass mt-8 flex max-w-xl items-center gap-2 rounded-full p-2 pl-5">
      <Search className="size-5 shrink-0 text-fg/55" />
      <input
        name="search"
        aria-label={t("Search events")}
        placeholder={t("Search artist, event or city")}
        className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-fg/45"
      />
      <button className="btn-grad rounded-full px-6 py-3 text-sm font-semibold cursor-pointer">{t("Find events")}</button>
    </form>
  );
}
