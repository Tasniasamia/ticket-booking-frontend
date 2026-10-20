import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddCurrencyButton } from "@/components/dashboard/admin/currency/add-currency-button";
import { CurrencyTable } from "@/components/dashboard/admin/currency/currency-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getCurrencyTableAction } from "@/features/currency/actions";
import { CURRENCY_FILTER_KEYS } from "@/features/currency/table-config";

export const metadata: Metadata = { title: "Currency" };

export default async function AdminCurrencyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, CURRENCY_FILTER_KEYS);
  const res = await getCurrencyTableAction(params);

  return (
    <div>
      <PageHeader title="Currency" subtitle="Setting currency" actions={<AddCurrencyButton />} />
      {res.success && res.currencies && res.meta ? (
        <CurrencyTable currencies={res.currencies} meta={res.meta} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load currencies" description={res.message} />
      )}
    </div>
  );
}
