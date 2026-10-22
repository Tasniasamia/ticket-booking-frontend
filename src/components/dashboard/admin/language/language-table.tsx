"use client";

import Link from "next/link";
import { Globe, Languages } from "lucide-react";
import { DataTable, type Column, type FilterConfig } from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { StatusBadge } from "@/components/common/badge/status-badge";
import { deleteLanguageAction } from "@/features/language/actions";
import type { Language } from "@/features/language/types";
import { LanguageForm } from "./language-form";

const FILTERS: FilterConfig[] = [
  { key: "is_active", label: "All statuses", options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }] },
  { key: "is_default", label: "All languages", options: [{ value: "true", label: "Default only" }, { value: "false", label: "Not default" }] },
];

const COLUMNS: Column<Language>[] = [
  { key: "name", header: "Language", cell: (l) => <span>{l.flag && <span className="mr-2">{l.flag}</span>}{l.name}</span> },
  { key: "code", header: "Code", cell: (l) => <span className="font-mono text-sm">{l.code}</span> },
  { key: "rtl", header: "Direction", cell: (l) => (l.rtl ? "RTL" : "LTR") },
  { key: "default", header: "Default", cell: (l) => (l.isDefault ? <StatusBadge label="Default" tone="warning" /> : "—") },
  { key: "status", header: "Status", cell: (l) => <StatusBadge label={l.isActive ? "active" : "inactive"} tone={l.isActive ? "success" : "danger"} /> },
  {
    key: "translate",
    header: "Translations",
    cell: (l) => (
      <Link
        href="/admin/translations"
        title={`Translate texts for ${l.name}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-fg/15 px-2.5 py-1.5 text-xs font-medium hover:bg-fg/5"
      >
        <Languages className="size-3.5" />
        Translate
      </Link>
    ),
  },
];

/** Function (column, action) Server Component থেকে পাঠানো যায় না, তাই এই client wrapper। */
export function LanguageTable({ languages, meta }: { languages: Language[]; meta: PaginationMeta }) {
  return (
    <DataTable
      columns={COLUMNS}
      data={languages}
      meta={meta}
      rowKey={(l) => l.id}
      filters={FILTERS}
      searchPlaceholder="Search by name or code"
      emptyState={{ icon: Globe, title: "No languages yet", description: "Add a language and it will show up here." }}
      actions={{
        edit: {
          dialog: {
            title: (l) => `${l.name} (${l.code})`,
            content: (l, close) => <LanguageForm language={l} onSuccess={close} />,
          },
        },
        delete: deleteLanguageAction,
      }}
    />
  );
}
