"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ListPlus, Loader2, Plus, Table2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  bulkSaveTranslationsAction,
  type BulkTranslationItem,
} from "@/features/translation/actions";
import type { Translation } from "@/features/translation/types";
import type { Language } from "@/features/language/types";
import { cn } from "@/lib/utils";

type NewRow = { id: number; key: string; values: Record<string, string> };

const cellClass =
  "w-full min-w-44 resize-y rounded-xl border border-fg/15 bg-fg/5 px-3 py-2 text-sm outline-none transition placeholder:text-fg/40 focus:border-coral";

export function BulkTranslationEditor({
  translations,
  languages,
}: {
  translations: Translation[];
  languages: Language[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  // edits[key][langCode] = নতুন মান (শুধু বদলানো cell)
  const [edits, setEdits] = useState<Record<string, Record<string, string>>>(
    {},
  );
  const [newRows, setNewRows] = useState<NewRow[]>([]);
  const [nextId, setNextId] = useState(1);
  const [paste, setPaste] = useState("");

  const original = useMemo(
    () => new Map(translations.map((t) => [t.key, t])),
    [translations],
  );

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
  };

  const addPasted = () => {
    const lines = [
      ...new Set(
        paste
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
      ),
    ];
    if (lines.length === 0) return;
    const hasEn = languages.some((l) => l.code === "en");
    setNewRows((r) => [
      ...r,
      ...lines.map(
        (line, i): NewRow => ({
          id: nextId + i,
          key: line,
          values: hasEn ? { en: line } : ({} as Record<string, string>),
        }),
      ),
    ]);
    setNextId((n) => n + lines.length);
    setPaste("");
  };

  const updateNew = (id: number, patch: Partial<NewRow>) =>
    setNewRows((rows) =>
      rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );

  const items = useMemo<BulkTranslationItem[]>(() => {
    const out: BulkTranslationItem[] = Object.entries(edits).map(
      ([key, values]) => ({ key, values }),
    );
    const seen = new Set(out.map((i) => i.key));
    for (const r of newRows) {
      const key = r.key.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const values = Object.fromEntries(
        Object.entries(r.values).filter(([, v]) => v.trim() !== ""),
      );
      out.push({
        key,
        values: Object.keys(values).length ? values : { en: key },
      });
    }
    return out;
  }, [edits, newRows]);

  const reset = () => {
    setEdits({});
    setNewRows([]);
    setPaste("");
  };

  const requestClose = () => {
    if (items.length > 0 && !confirm("You have unsaved changes. Discard them?"))
      return;
    reset();
    setOpen(false);
  };

  const save = () =>
    startTransition(async () => {
      const res = await bulkSaveTranslationsAction(items);
      if (!res.success)
        return void toast.error(res.message ?? "Could not save.");
      toast.success(res.message ?? "Saved.");
      reset();
      setOpen(false);
      router.refresh();
    });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-fg/10"
      >
        <Table2 className="size-4" /> Bulk edit
      </button>

      <Dialog open={open} onOpenChange={(o) => !o && requestClose()}>
        <DialogContent className="cursor-default rounded-3xl bg-panel p-6 ring-fg/15 sm:max-w-6xl">
          <DialogTitle className="text-lg font-bold">
            Bulk edit translations
          </DialogTitle>
          <DialogDescription className="text-sm text-fg/60">
            Edit any cells on this page, add new texts, then save everything at
            once. Only changed cells are sent.
          </DialogDescription>

          <div className="max-h-[56vh] overflow-auto rounded-2xl border border-fg/15">
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
                {translations.map((t) => (
                  <tr
                    key={t.key}
                    className={cn(
                      "border-b border-fg/10 align-top",
                      edits[t.key] && "bg-coral/5",
                    )}
                  >
                    <td className="px-3 py-2 text-sm font-medium">{t.key}</td>
                    {languages.map((l) => (
                      <td key={l.code} className="px-2 py-2">
                        <textarea
                          rows={1}
                          dir={l.rtl ? "rtl" : "ltr"}
                          aria-label={`${t.key} — ${l.name}`}
                          value={
                            edits[t.key]?.[l.code] ?? t.values[l.code] ?? ""
                          }
                          onChange={(e) =>
                            setCell(t.key, l.code, e.target.value)
                          }
                          className={cn(
                            cellClass,
                            edits[t.key]?.[l.code] !== undefined &&
                              "border-coral",
                          )}
                        />
                      </td>
                    ))}
                    <td />
                  </tr>
                ))}

                {newRows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-fg/10 bg-coral/5 align-top"
                  >
                    <td className="px-2 py-2">
                      <input
                        value={r.key}
                        onChange={(e) =>
                          updateNew(r.id, { key: e.target.value })
                        }
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
                          onChange={(e) =>
                            updateNew(r.id, {
                              values: { ...r.values, [l.code]: e.target.value },
                            })
                          }
                          className={cellClass}
                        />
                      </td>
                    ))}
                    <td className="px-1 py-2">
                      <button
                        type="button"
                        aria-label="Remove row"
                        onClick={() =>
                          setNewRows((rows) =>
                            rows.filter((x) => x.id !== r.id),
                          )
                        }
                        className="grid size-9 cursor-pointer place-items-center rounded-full text-fg/60 transition hover:bg-red-500/15 hover:text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="space-y-2">
              <textarea
                rows={2}
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                placeholder={
                  "Paste many English texts, one per line\nHome\nLog in\nBook now"
                }
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
              {items.length === 0
                ? "No changes yet."
                : `${items.length} text${items.length === 1 ? "" : "s"} changed.`}
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
                disabled={pending || items.length === 0}
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
