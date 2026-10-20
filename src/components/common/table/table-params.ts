// Server আর client দুই জায়গাতেই চলে।

/** Backend এর httpresponse.PaginationMeta (docs ছাড়া অংশ) */
export type PaginationMeta = {
  totalDocs: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

export type TableParams = { page: number; limit: number; search: string; filters: Record<string, string> };

type Raw = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Page এর searchParams → TableParams। filterKeys হলো whitelist, অন্য কিছু backend এ যাবে না। */
export function parseTableParams(raw: Raw, filterKeys: string[] = [], limit = 5): TableParams {
  const filters: Record<string, string> = {};
  for (const k of filterKeys) {
    const v = first(raw[k]);
    if (v) filters[k] = v;
  }
  return {
    page: Math.max(1, parseInt(first(raw.page) ?? "1", 10) || 1),
    limit,
    search: (first(raw.search) ?? "").trim(),
    filters,
  };
}

/** Backend এর query: page, limit, search + filter */
export function toApiParams(p: TableParams): Record<string, string | number> {
  const out: Record<string, string | number> = { page: p.page, limit: p.limit, ...p.filters };
  if (p.search) out.search = p.search;
  return out;
}
