export const instant = false


import { connection } from "next/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { BulkTranslationEditor } from "@/components/dashboard/admin/translation/bulk-translation-editor";
import { AddTranslationButton } from "@/components/dashboard/admin/translation/add-translation-button";
import { SyncTranslationsButton } from "@/components/dashboard/admin/translation/sync-translations-button";
import { TranslationTable } from "@/components/dashboard/admin/translation/translation-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getLanguagesAction } from "@/features/language/actions";
import { getTranslationTableAction } from "@/features/translation/actions";

export const metadata: Metadata = { title: "Translations" };

async function TranslationsContent({
  params,
}: {
  params: ReturnType<typeof parseTableParams>;
}) {
  await connection();

  const [res, langs] = await Promise.all([
    getTranslationTableAction(params),
    getLanguagesAction(),
  ]);
  const languages = langs.languages ?? [];

  return (
    <div>
      <PageHeader
        title="Translations"
        subtitle="Static English texts from the site. Fill in each language — empty cells fall back to English."
        actions={
          <>
            <SyncTranslationsButton />
            {languages.length > 0 && res.success && res.translations && (
              <BulkTranslationEditor
                translations={res.translations}
                languages={languages}
              />
            )}
            {languages.length > 0 && (
              <AddTranslationButton languages={languages} />
            )}
          </>
        }
      />

      {res.success && res.translations && res.meta && langs.success ? (
        <TranslationTable
          translations={res.translations}
          languages={languages}
          meta={res.meta}
        />
      ) : (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load translations"
          description={res.message ?? langs.message}
        />
      )}
    </div>
  );
}

export default async function AdminTranslationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, [], 10);

  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted-foreground">
          Loading translations...
        </div>
      }
    >
      <TranslationsContent params={params} />
    </Suspense>
  );
}