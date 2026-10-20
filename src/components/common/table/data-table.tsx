"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Eye, Loader2, Pencil, Search, Trash2, type LucideIcon } from "lucide-react";
import { toast } from "react-toastify";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Modal } from "./modal";
import type { PaginationMeta } from "./table-params";
import { TablePagination } from "./table-pagination";
import { tableTheme } from "./table-theme";

export type Column<T> = {
  key: string;
  header: string;
  /** না দিলে row[key] দেখায় */
  cell?: (row: T) => ReactNode;
  className?: string;
};

/** href দিলে অন্য page এ যায়; dialog দিলে common dialog খোলে (content = আপনার form/details)। */
export type RowAction<T> = {
  href?: (row: T) => string;
  dialog?: {
    title: string | ((row: T) => string);
    content: (row: T, close: () => void) => ReactNode;
  };
};

export type ActionResult = { success: boolean; message?: string };
export type FilterConfig = { key: string; label: string; options: { value: string; label: string }[] };

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  meta: PaginationMeta;
  /** row এর id। delete এ এটাই deleteAction এ যায়। */
  rowKey: (row: T) => string | number;
  actions?: {
    view?: RowAction<T>;
    edit?: RowAction<T>;
    /** id নিয়ে server action। success/error message এ toast নিজেই দেখায়। */
    delete?: (id: string | number) => Promise<ActionResult>;
  };
  filters?: FilterConfig[];
  searchPlaceholder?: string;
  /** data একেবারে না থাকলে ComingSoon এর মতো এই box দেখায় */
  emptyState?: { icon?: LucideIcon; title?: string; description?: string; action?: ReactNode };
};

function IconBtn({ label, icon: Icon, tone, href, onClick, loading }: {
  label: string; icon: LucideIcon; tone: string; href?: string; onClick?: () => void; loading?: boolean;
}) {
  const cls = cn(tableTheme.actionBase, tone);
  const icon = loading ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />;
  return href ? (
    <Link href={href} title={label} aria-label={label} className={cls}>{icon}</Link>
  ) : (
    <button type="button" title={label} aria-label={label} onClick={onClick} disabled={loading} className={cls}>{icon}</button>
  );
}

export function DataTable<T>({ columns, data, meta, rowKey, actions, filters = [], searchPlaceholder = "Search...", emptyState }: Props<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const urlSearch = sp.get("search") ?? "";
  const [text, setText] = useState(urlSearch);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [open, setOpen] = useState<{ row: T; action: RowAction<T> } | null>(null);

  /** URL ই table এর state (page, search, filter)। refresh/back/share সব কাজ করে। */
  const update = (patch: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "") q.delete(k);
      else q.set(k, String(v));
    }
    if (!("page" in patch)) q.delete("page");
    const qs = q.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // টাইপ থামার ৪০০ms পর search হয়
  useEffect(() => {
    if (text.trim() === urlSearch) return;
    const t = setTimeout(() => update({ search: text.trim() }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const hasQuery = !!urlSearch || filters.some((f) => sp.get(f.key));
  if (data.length === 0 && !hasQuery && meta.totalDocs === 0) return <EmptyState {...emptyState} />;

  const remove = async (id: string | number) => {
    setDeletingId(id);
    const res = await actions!.delete!(id);
    setDeletingId(null);
    if (!res.success) return toast.error(res.message ?? "Could not delete.");
    toast.success(res.message ?? "Deleted successfully.");
    if (data.length === 1 && meta.page > 1) update({ page: meta.page - 1 });
    else router.refresh();
  };

  const act = (action: RowAction<T>, row: T) => ({
    href: action.href?.(row),
    onClick: () => action.dialog && setOpen({ row, action }),
  });
  const close = () => { setOpen(null); router.refresh(); };

  const hasActions = !!(actions?.view || actions?.edit || actions?.delete);
  const title = open?.action.dialog ? (typeof open.action.dialog.title === "function" ? open.action.dialog.title(open.row) : open.action.dialog.title) : "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className={cn(tableTheme.control, "flex min-w-0 flex-1 items-center gap-3 sm:max-w-sm")}>
          <Search className="size-4.5 shrink-0 text-fg/55" />
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={searchPlaceholder} aria-label={searchPlaceholder} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg/40" />
        </label>
        {filters.map((f) => (
          <select key={f.key} aria-label={f.label} value={sp.get(f.key) ?? ""} onChange={(e) => update({ [f.key]: e.target.value })} className={cn(tableTheme.control, "cursor-pointer")}>
            <option value="" className="bg-panel">{f.label}</option>
            {f.options.map((o) => <option key={o.value} value={o.value} className="bg-panel">{o.label}</option>)}
          </select>
        ))}
      </div>

      <div className={tableTheme.card}>
        <Table>
          <TableHeader>
            <TableRow className={tableTheme.headRow}>
              {columns.map((c) => <TableHead key={c.key} className={cn(tableTheme.head, c.className)}>{c.header}</TableHead>)}
              {hasActions && <TableHead className={cn(tableTheme.head, "text-right")}>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length + 1} className={cn("py-14 text-center", tableTheme.muted)}>
                  No results found.{" "}
                  <button type="button" className={cn("cursor-pointer font-semibold", tableTheme.accent)} onClick={() => { setText(""); update({ search: undefined, ...Object.fromEntries(filters.map((f) => [f.key, undefined])) }); }}>
                    Clear filters
                  </button>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const id = rowKey(row);
                return (
                  <TableRow key={id} className={tableTheme.row}>
                    {columns.map((c) => (
                      <TableCell key={c.key} className={cn(tableTheme.cell, c.className)}>
                        {c.cell ? c.cell(row) : String((row as Record<string, unknown>)[c.key] ?? "—")}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell className={tableTheme.cell}>
                        <div className="flex justify-end gap-1">
                          {actions?.view && <IconBtn label="View" icon={Eye} tone={tableTheme.actionView} {...act(actions.view, row)} />}
                          {actions?.edit && <IconBtn label="Edit" icon={Pencil} tone={tableTheme.actionEdit} {...act(actions.edit, row)} />}
                          {actions?.delete && <IconBtn label="Delete" icon={Trash2} tone={tableTheme.actionDelete} loading={deletingId === id} onClick={() => remove(id)} />}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {meta.totalDocs > 0 && <TablePagination meta={meta} onPage={(page) => update({ page })} />}
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={title}>
        {open?.action.dialog?.content(open.row, close)}
      </Modal>
    </div>
  );
}
