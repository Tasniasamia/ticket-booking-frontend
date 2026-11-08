import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddLanguageButton } from "@/components/dashboard/admin/language/add-language-button";
import { LanguageTable } from "@/components/dashboard/admin/language/language-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getLanguageTableAction } from "@/features/language/actions";

export const metadata: Metadata = { title: "Languages" };

async function LanguagesContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["is_active", "is_default"], 10);
  const res = await getLanguageTableAction(params);

  if (res.success && res.languages && res.meta) {
    return <LanguageTable languages={res.languages} meta={res.meta} />;
  }
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Could not load languages"
      description={res.message}
    />
  );
}

export default function AdminLanguagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div>
      <PageHeader
        title="Languages"
        subtitle="Add languages, set the site default, then open Translations to fill in each text."
        actions={<AddLanguageButton />}
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <LanguagesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
