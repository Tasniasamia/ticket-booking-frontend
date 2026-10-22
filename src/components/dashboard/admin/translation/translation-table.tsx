"use client";

import { Languages } from "lucide-react";
import { DataTable, type Column } from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { deleteTranslationAction } from "@/features/translation/actions";
import type { Translation } from "@/features/translation/types";
import type { Language } from "@/features/language/types";
import { SyncTranslationsButton } from "./sync-translations-button";
import { TranslationForm } from "./translation-form";

/** Function (column, action) Server Component থেকে পাঠানো যায় না, তাই এই client wrapper। */
export function TranslationTable({ translations, languages, meta }: { translations: Translation[]; languages: Language[]; meta: PaginationMeta }) {
  // key + প্রতিটা active ভাষার জন্য একটা করে column। অনুবাদ না থাকলে "—" (সেখানে fallback ভাষা দেখায়)।
  const columns: Column<Translation>[] = [
    { key: "key", header: "English text", cell: (t) => <span className="max-w-xs text-sm font-medium">{t.key}</span> },
    ...languages.map<Column<Translation>>((l) => ({
      key: `lang-${l.code}`,
      header: `${l.name} (${l.code})`,
      cell: (t) =>
        t.values[l.code]?.trim() ? (
          <span dir={l.rtl ? "rtl" : "ltr"} className="line-clamp-2 max-w-64 text-sm">{t.values[l.code]}</span>
        ) : (
          <span className="text-fg/30">—</span>
        ),
    })),
  ];

  return (
    <DataTable
      columns={columns}
      data={translations}
      meta={meta}
      rowKey={(t) => t.key}
      searchPlaceholder="Search by English text"
      emptyState={{
        icon: Languages,
        title: "No texts yet",
        description: "Sync static English texts from the code, then translate each one into every language.",
        action: <SyncTranslationsButton />,
      }}
      actions={{
        edit: {
          dialog: {
            title: (t) => t.key,
            content: (t, close) => <TranslationForm translation={t} languages={languages} onSuccess={close} />,
          },
        },
        delete: deleteTranslationAction,
      }}
    />
  );
}
