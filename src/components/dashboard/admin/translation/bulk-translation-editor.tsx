"use client";
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ListPlus, Loader2, Plus, Search, Table2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  bulkSaveTranslationsAction,
  getAllTranslationsAction,
  type BulkTranslationItem,
} from "@/features/translation/actions";
import type { Translation } from "@/features/translation/types";
import type { Language } from "@/features/language/types";
import { cn } from "@/lib/utils";

type NewRow = { id: number; key: string; values: Record<string, string> };

const PAGE_SIZE = 50; // একসাথে কতগুলো row আঁকা হবে (হাজার হাজার textarea একসাথে আঁকলে ধীর হয়)

const cellClass =
  "w-full min-w-44 pretty-scroll resize-y rounded-xl border border-fg/15 bg-fg/5 px-3 py-2 text-sm outline-none transition placeholder:text-fg/40 focus:border-coral";

/**
 * Bulk editor: page এর সাথে সম্পর্ক নেই। খুললে সব key আনে।
 * - Search: English text বা যেকোনো ভাষার লেখা দিয়ে খোঁজা
 * - "Missing in": কোন ভাষার অনুবাদ বাকি, শুধু সেগুলো দেখায়
 * - Filter বদলালেও আগের edit হারায় না (edit গুলো key ধরে জমা থাকে)
 * - Save এ একটাই request: PUT /translations/bulk (শুধু বদলানো cell যায়)
 */
export function BulkTranslationEditor({ languages }: { languages: Language[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [all, setAll] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // edits[key][langCode] = নতুন মান (শুধু বদলানো cell)
  const [edits, setEdits] = useState<Record<string, Record<string, string>>>({});
  const [newRows, setNewRows] = useState<NewRow[]>([]);
  const [nextId, setNextId] = useState(1);
  const [paste, setPaste] = useState("");

  const [search, setSearch] = useState("");
  const [missingLang, setMissingLang] = useState(""); // "" = সব, নয়তো ভাষার code
  const [shown, setShown] = useState(PAGE_SIZE);

  // নতুন row গুলো table এর উপরে বসে, তাই যোগ করার পর উপরে স্ক্রল করে নিয়ে যাই
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
// const scrollToTop = () => {
//   const el = scrollRef.current;
//   if (!el || el.scrollTop === 0) return;

//   const start = el.scrollTop;
//   const duration = Math.min(700, 250 + start * 0.3); // যত দূর থেকে আসছে তত একটু বেশি সময়, সর্বোচ্চ ০.৭ সেকেন্ড
//   const t0 = performance.now();

//   const step = (now: number) => {
//     const p = Math.min((now - t0) / duration, 1);
//     const eased = 1 - Math.pow(1 - p, 3); // শুরুতে দ্রুত, শেষে ধীরে থামে
//     el.scrollTop = start * (1 - eased);
//     if (p < 1) requestAnimationFrame(step);
//   };
//   requestAnimationFrame(step);
// };
  // বাটন চাপলে (event handler এ) সব key নতুন করে আনি, যাতে সবচেয়ে সাম্প্রতিক ডেটা পাই।
  // এখানে state বদলানো ঠিক আছে, কারণটা user এর click। useEffect এ করলে cascading render হয়।
  const openEditor = () => {
    setOpen(true);
    setLoading(true);
    setLoadError(null);
    getAllTranslationsAction().then((res) => {
      if (res.success) setAll(res.translations ?? []);
      else setLoadError(res.message ?? "Could not load translations.");
      setLoading(false);
    });
  };

  // Filter বদলালে তালিকা ছোট হয়ে যায়, তাই "কতগুলো দেখাচ্ছি" আবার প্রথম ৫০ এ ফেরে।
  const changeSearch = (value: string) => {
    setSearch(value);
    setShown(PAGE_SIZE);
  };
  const changeMissingLang = (value: string) => {
    setMissingLang(value);
    setShown(PAGE_SIZE);
  };

  const original = useMemo(() => new Map(all.map((t) => [t.key, t])), [all]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((t) => {
      if (missingLang && t.values[missingLang]?.trim()) return false;
      if (!q) return true;
      return (
        t.key.toLowerCase().includes(q) ||
        Object.values(t.values).some((v) => v.toLowerCase().includes(q))
      );
    });
  }, [all, search, missingLang]);

  const visible = filtered.slice(0, shown);

  const setCell = (key: string, code: string, value: string) =>
    setEdits((prev) => {
      const base = original.get(key)?.values[code] ?? "";
      const row = { ...(prev[key] ?? {}) };
      if (value === base) delete row[code];
      else row[code] = value;
      const next = { ...prev };
      if (Object.keys(row).length === 0) delete next[key];
      else next[key] = row;
      return next;
    });

  const addRow = (key = "", values: Record<string, string> = {}) => {
    setNewRows((r) => [...r, { id: nextId, key, values }]);
    setNextId((n) => n + 1);
    scrollToTop();
  };

  const addPasted = () => {
    const lines = [...new Set(paste.split("\n").map((l) => l.trim()).filter(Boolean))];
    if (lines.length === 0) return;
    const hasEn = languages.some((l) => l.code === "en");
    setNewRows((r) => [
      ...r,
      ...lines.map((line, i): NewRow => ({
        id: nextId + i,
        key: line,
        values: hasEn ? { en: line } : ({} as Record<string, string>),
      })),
    ]);
    setNextId((n) => n + lines.length);
    setPaste("");
    scrollToTop();
  };

  const updateNew = (id: number, patch: Partial<NewRow>) =>
    setNewRows((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const items = useMemo<BulkTranslationItem[]>(() => {
    const out: BulkTranslationItem[] = Object.entries(edits).map(([key, values]) => ({ key, values }));
    const seen = new Set(out.map((i) => i.key));
    for (const r of newRows) {
      const key = r.key.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const values = Object.fromEntries(Object.entries(r.values).filter(([, v]) => v.trim() !== ""));
      out.push({ key, values: Object.keys(values).length ? values : { en: key } });
    }
    return out;
  }, [edits, newRows]);

  const reset = () => {
    setEdits({});
    setNewRows([]);
    setPaste("");
    setSearch("");
    setMissingLang("");
    setShown(PAGE_SIZE);
  };

  const requestClose = () => {
    if (items.length > 0 && !confirm("You have unsaved changes. Discard them?")) return;
    reset();
    setOpen(false);
  };

  const save = () =>
    startTransition(async () => {
      const res = await bulkSaveTranslationsAction(items);
      if (!res.success) return void toast.error(res.message ?? "Could not save.");
      toast.success(res.message ?? "Saved.");
      reset();
      setOpen(false);
      router.refresh();
    });

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        className="glass inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-fg/10"
      >
        <Table2 className="size-4" /> Bulk edit
      </button>

      <Dialog open={open} onOpenChange={(o) => !o && requestClose()}>
        <DialogContent className="cursor-default rounded-3xl bg-panel p-6 ring-fg/15 sm:max-w-6xl">
          <DialogTitle className="text-lg font-bold">Bulk edit translations</DialogTitle>
          <DialogDescription className="text-sm text-fg/60">
            All texts are listed here, not only the current page. Search or filter, edit any cells, then save everything at once.
          </DialogDescription>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-full border border-fg/15 bg-fg/5 px-4 text-sm focus-within:border-coral sm:max-w-sm">
              <Search className="size-4 shrink-0 text-fg/55" />
              <input
                value={search}
                onChange={(e) => changeSearch(e.target.value)}
                placeholder="Search any text or translation"
                aria-label="Search texts"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg/40"
              />
            </label>
            <select
              value={missingLang}
              onChange={(e) => changeMissingLang(e.target.value)}
              aria-label="Show only texts missing a language"
              className="h-10 cursor-pointer rounded-full border border-fg/15 bg-fg/5 px-4 text-sm outline-none focus:border-coral"
            >
              <option value="" className="bg-panel">Missing in: any</option>
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-panel">
                  Missing in {l.name} ({l.code})
                </option>
              ))}
            </select>
            {!loading && !loadError && (
              <p className="text-sm text-fg/60">
                {filtered.length === all.length
                  ? `${all.length} texts`
                  : `${filtered.length} of ${all.length} texts`}
              </p>
            )}
          </div>
          {/* <div className="overflow-auto rounded-2xl"> */}
          <div ref={scrollRef} className="pretty-scroll  max-h-[50vh] overflow-auto rounded-2xl border border-fg/15">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-fg/60">
                <Loader2 className="size-4 animate-spin" /> Loading all texts...
              </div>
            ) : loadError ? (
              <div className="py-16 text-center text-sm text-red-500">{loadError}</div>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 bg-panel">
                  <tr className="border-b border-fg/10 bg-fg/5 text-xs font-semibold uppercase tracking-wide text-fg/60">
                    <th className="min-w-48 px-3 py-3">English text (key)</th>
                    {languages.map((l) => (
                      <th key={l.code} className="px-3 py-3">
                        {l.name} ({l.code})
                      </th>
                    ))}
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {newRows.map((r) => (
                    <tr key={r.id} className="border-b border-fg/10 bg-coral/5 align-top">
                      <td className="px-2 py-2">
                        <input
                          value={r.key}
                          onChange={(e) => updateNew(r.id, { key: e.target.value })}
                          placeholder="New English text"
                          aria-label="New English text"
                          className={cellClass}
                        />
                      </td>
                      {languages.map((l) => (
                        <td key={l.code} className="px-2 py-2">
                          <textarea
                            rows={1}
                            dir={l.rtl ? "rtl" : "ltr"}
                            aria-label={`New text — ${l.name}`}
                            value={r.values[l.code] ?? ""}
                            onChange={(e) => updateNew(r.id, { values: { ...r.values, [l.code]: e.target.value } })}
                            className={cellClass}
                          />
                        </td>
                      ))}
                      <td className="px-1 py-2">
                        <button
                          type="button"
                          aria-label="Remove row"
                          onClick={() => setNewRows((rows) => rows.filter((x) => x.id !== r.id))}
                          className="grid size-9 cursor-pointer place-items-center rounded-full text-fg/60 transition hover:bg-red-500/15 hover:text-red-500"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* {visible.map((t) => (
                    <tr key={t.key} className={cn("border-b border-fg/10 align-top", edits[t.key] && "bg-coral/5")}>
                      <td className="px-3 py-2 text-sm font-medium truncate" title={t.key}>
                        {t.key}
                      </td>
                      {languages.map((l) => (
                        <td key={l.code} className="px-2 py-2 " >
                          <textarea
                            rows={1} title={t.values[l.code]}
                            dir={l.rtl ? "rtl" : "ltr"}
                            aria-label={`${t.key} — ${l.name}`}
                            value={edits[t.key]?.[l.code] ?? t.values[l.code] ?? ""}
                            onChange={(e) => setCell(t.key, l.code, e.target.value)}
                            className={cn(cellClass, edits[t.key]?.[l.code] !== undefined && "border-coral truncate")}
                          />
                        </td>
                      ))}
                      <td />
                    </tr>
                  ))} */}
{visible.map((t) => (
  <tr key={t.key} className={cn("border-b border-fg/10 align-top", edits[t.key] && "bg-coral/5")}>
    <td className="px-3 py-2 text-sm font-medium">
      <div className="max-w-64 truncate py-2" title={t.key}>
        {t.key}
      </div>
    </td>
    {languages.map((l) => {
      const value = edits[t.key]?.[l.code] ?? t.values[l.code] ?? "";
      return (
        <td key={l.code} className="px-2 py-2">
          <input
            type="text"
            dir={l.rtl ? "rtl" : "ltr"}
            title={value}
            aria-label={`${t.key} — ${l.name}`}
            value={value}
            onChange={(e) => setCell(t.key, l.code, e.target.value)}
            className={cn(
              cellClass,
              "max-w-64 truncate",
              edits[t.key]?.[l.code] !== undefined && "border-coral",
            )}
          />
        </td>
      );
    })}
    <td />
  </tr>
))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={languages.length + 2} className="py-12 text-center text-sm text-fg/60">
                        No texts match. Try a different search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          {/* </div> */}

          {!loading && filtered.length > shown && (
            <button
              type="button"
              onClick={() => setShown((n) => n + PAGE_SIZE)}
              className="glass mx-auto cursor-pointer rounded-full px-5 py-2 text-sm font-semibold hover:bg-fg/10"
            >
              Show {Math.min(PAGE_SIZE, filtered.length - shown)} more ({filtered.length - shown} hidden)
            </button>
          )}

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="space-y-2">
              <textarea
                rows={2}
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                placeholder={"Paste many new English texts, one per line\nHome\nLog in\nBook now"}
                aria-label="Paste many English texts"
                className={cellClass + " w-full"}
              />
              <button
                type="button"
                onClick={addPasted}
                disabled={!paste.trim()}
                className="glass inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold hover:bg-fg/10 disabled:opacity-50"
              >
                <ListPlus className="size-4" /> Add lines as new rows
              </button>
            </div>
            <button
              type="button"
              onClick={() => addRow()}
              className="glass inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold hover:bg-fg/10"
            >
              <Plus className="size-4" /> Add empty row
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-fg/60">
              {items.length === 0 ? "No changes yet." : `${items.length} text${items.length === 1 ? "" : "s"} changed.`}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={requestClose}
                className="glass cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-fg/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={pending || loading || items.length === 0}
                className="btn-grad inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {pending && <Loader2 className="size-4 animate-spin" />}
                Save all changes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}