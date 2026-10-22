import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddLanguageButton } from "@/components/dashboard/admin/language/add-language-button";
import { LanguageTable } from "@/components/dashboard/admin/language/language-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getLanguageTableAction } from "@/features/language/actions";

export const metadata: Metadata = { title: "Languages" };

export default async function AdminLanguagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["is_active", "is_default"], 10);
  const res = await getLanguageTableAction(params);

  return (
    <div>
      <PageHeader title="Languages" subtitle="Add languages, set the site default, then open Translations to fill in each text." actions={<AddLanguageButton />} />
      {res.success && res.languages && res.meta ? (
        <LanguageTable languages={res.languages} meta={res.meta} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load languages" description={res.message} />
      )}
    </div>
  );
}
