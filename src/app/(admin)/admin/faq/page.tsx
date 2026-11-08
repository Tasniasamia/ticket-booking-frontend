import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddFAQButton } from "@/components/dashboard/admin/faq/add-faq-button";
import { FAQTable } from "@/components/dashboard/admin/faq/faq-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getFAQTableAction } from "@/features/faq/actions";

export const metadata: Metadata = { title: "FAQs" };

async function FAQContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["is_active"], 10);
  const res = await getFAQTableAction(params);

  if (res.success && res.faqs && res.meta) {
    return <FAQTable faqs={res.faqs} meta={res.meta} />;
  }
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Could not load FAQs"
      description={res.message}
    />
  );
}

export default function AdminFAQPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div>
      <PageHeader
        title="FAQs"
        subtitle="Manage frequently asked questions."
        actions={<AddFAQButton />}
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <FAQContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
