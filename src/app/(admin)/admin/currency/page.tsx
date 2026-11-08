import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddCurrencyButton } from "@/components/dashboard/admin/currency/add-currency-button";
import { CurrencyTable } from "@/components/dashboard/admin/currency/currency-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getCurrencyTableAction } from "@/features/currency/actions";

export const metadata: Metadata = { title: "Currency" };

async function CurrencyContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["is_default"], 3);
  const res = await getCurrencyTableAction(params);

  if (res.success && res.currencies && res.meta) {
    return <CurrencyTable currencies={res.currencies} meta={res.meta} />;
  }
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Could not load currencies"
      description={res.message}
    />
  );
}

export default function AdminCurrencyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div>
      <PageHeader
        title="Currency"
        subtitle="Setting currency"
        actions={<AddCurrencyButton />}
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <CurrencyContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
