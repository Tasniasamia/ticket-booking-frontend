"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/providers/preferences-provider";
import { useUrlParams } from "@/components/common/filters/use-url-params";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { getPageList } from "./page-list";

type Props = {
  /** backend এর pagination meta (httpresponse.PaginationMeta) */
  meta: PaginationMeta;
  /** না দিলে URL এর ?page= বদলায় (Server Component list page এর জন্য), দিলে নিজের state এ চলে */
  onPage?: (page: number) => void;
  className?: string;
};

const btn =
  "grid h-10 min-w-10 cursor-pointer place-items-center rounded-full px-3 text-sm font-semibold transition hover:bg-fg/10 focus-visible:outline-2 focus-visible:outline-coral disabled:pointer-events-none disabled:opacity-40";

/** Public list page এর pagination। যেখানে backend থেকে PaginationMeta আসে সেখানেই বসে: <Pager meta={meta} /> */
export function Pager({ meta, onPage, className }: Props) {
  const t = useT();
  const { update } = useUrlParams();
  const { page, limit, totalDocs, totalPages, hasPrevPage, hasNextPage } = meta;
  if (totalPages <= 1) return null;

  const go = (p: number) => (onPage ? onPage(p) : update({ page: p }));
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalDocs);

  return (
    <div className={cn("mt-12 flex flex-col items-center gap-4", className)}>
      <nav aria-label={t("Pagination")} className="glass flex items-center gap-1 rounded-full p-1.5">
        <button type="button" aria-label={t("Previous page")} disabled={!hasPrevPage} onClick={() => go(page - 1)} className={btn}>
          <ChevronLeft className="size-4" />
        </button>
        {getPageList(page, totalPages).map((p) =>
          typeof p === "string" ? (
            <span key={p} aria-hidden className="px-1 text-fg/40">…</span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === page ? "page" : undefined}
              onClick={() => p !== page && go(p)}
              className={cn(btn, p === page && "btn-grad hover:opacity-90")}
            >
              {p}
            </button>
          ),
        )}
        <button type="button" aria-label={t("Next page")} disabled={!hasNextPage} onClick={() => go(page + 1)} className={btn}>
          <ChevronRight className="size-4" />
        </button>
      </nav>
      <p className="text-sm text-fg/60">{t("Showing {from}–{to} of {total}", { from, to, total: totalDocs })}</p>
    </div>
  );
}
