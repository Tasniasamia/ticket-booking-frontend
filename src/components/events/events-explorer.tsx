"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EventCard } from "./event-card";
import { CATEGORIES, EVENTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Backend ready হলে: filter গুলো URL query তে নিয়ে Server Component এ fetch করো।
export function EventsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const list = useMemo(
    () => EVENTS.filter((e) =>
      (category === "All" || e.category === category) &&
      `${e.title} ${e.location}`.toLowerCase().includes(query.trim().toLowerCase())),
    [query, category],
  );

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="glass flex max-w-md flex-1 items-center gap-3 rounded-full px-5 py-3">
          <Search className="size-5 shrink-0 text-fg/55" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or city" aria-label="Search events" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg/45" />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}
              className={cn("rounded-full px-5 py-2.5 text-sm font-semibold transition cursor-pointer", category === c ? "btn-grad" : "glass hover:bg-fg/10")}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      ) : (
        <div className="glass rounded-4xl p-12 text-center">
          <p className="text-lg font-semibold">No events match your search</p>
          <p className="mt-2 text-fg/60">Try a different name or choose another category.</p>
          <button onClick={() => { setQuery(""); setCategory("All"); }} className="btn-grad cursor-pointer mt-6 rounded-full px-6 py-2.5 font-semibold">Clear filters</button>
        </div>
      )}
    </div>
  );
}
