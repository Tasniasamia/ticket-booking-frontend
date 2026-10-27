"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "./table-params";
import { tableTheme } from "./table-theme";
import { getPageList } from "@/components/common/pagination/page-list";

export function TablePagination({ meta, onPage }: { meta: PaginationMeta; onPage: (page: number) => void }) {
  const { page, limit, totalDocs, totalPages, hasPrevPage, hasNextPage } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalDocs);

  return (
    <div className={cn("flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between", tableTheme.divider)}>
      <p className={cn("text-sm", tableTheme.muted)}>
        Showing <b className="text-fg">{from}–{to}</b> of <b className="text-fg">{totalDocs}</b>
      </p>

      {totalPages > 1 && (
        <nav aria-label="pagination" className="flex items-center gap-1">
          <button type="button" aria-label="Previous page" disabled={!hasPrevPage} onClick={() => onPage(page - 1)} className={tableTheme.pageBtn}>
            <ChevronLeft className="size-4" />
          </button>
          {getPageList(page, totalPages).map((p) =>
            typeof p === "string" ? (
              <span key={p} className="px-1 text-fg/40">…</span>
            ) : (
              <button
                key={p}
                type="button"
                aria-current={p === page ? "page" : undefined}
                onClick={() => p !== page && onPage(p)}
                className={cn(tableTheme.pageBtn, p === page && tableTheme.pageBtnActive)}
              >
                {p}
              </button>
            ),
          )}
          <button type="button" aria-label="Next page" disabled={!hasNextPage} onClick={() => onPage(page + 1)} className={tableTheme.pageBtn}>
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
