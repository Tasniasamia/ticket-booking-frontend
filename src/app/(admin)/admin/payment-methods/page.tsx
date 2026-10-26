import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { AddPaymentMethodButton } from "@/components/dashboard/admin/payment-method/add-payment-method-button";
import { PaymentMethodTable } from "@/components/dashboard/admin/payment-method/payment-method-table";
import { getPaymentMethodTableAction } from "@/features/payment-method/actions";
import type {
  PaginationMeta,
  TableParams,
} from "@/components/common/table/table-params";
import { Wallet } from "lucide-react";
import { EmptyState } from "@/components/dashboard/shared/empty-state";

export const metadata: Metadata = { title: "Payment methods" };

type SearchParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const EMPTY_META = {
  totalDocs: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasPrevPage: false,
  hasNextPage: false,
} satisfies PaginationMeta;

async function PaymentMethodsContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const enable = first(sp.enable);
  const params: TableParams = {
    page: Math.max(1, Number(first(sp.page)) || 1),
    limit: Number(first(sp.limit)) || 10,
    search: (first(sp.search) ?? "").trim(),
    filters: enable === "true" || enable === "false" ? { enable } : {},
  };

  const res = await getPaymentMethodTableAction(params);
  if (!res.success)
    return (
      <EmptyState
        icon={Wallet}
        title="Could not load payment methods"
        description={res.message ?? "Could not load payment methods."}
      />
    );
  return (
    <PaymentMethodTable
      paymentMethods={res.paymentMethods ?? []}
      meta={res.meta ?? EMPTY_META}
    />
  );
}

export default function PaymentMethodsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div>
      <PageHeader
        title="Payment methods"
        subtitle="Gateways customers can pay with, their logo and credentials."
        actions={<AddPaymentMethodButton />}
      />
      <Suspense
        fallback={<div className="h-64 animate-pulse rounded-3xl bg-fg/10" />}
      >
        <PaymentMethodsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
