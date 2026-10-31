export const instant = false;
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddFAQButton } from "@/components/dashboard/admin/faq/add-faq-button";
import { FAQTable } from "@/components/dashboard/admin/faq/faq-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getFAQTableAction } from "@/features/faq/actions";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFAQPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = parseTableParams(await searchParams, ["is_active"], 10);
  const res = await getFAQTableAction(params);
  return (
    <div>
      <PageHeader title="FAQs" subtitle="Manage frequently asked questions." actions={<AddFAQButton />} />
      {res.success && res.faqs && res.meta ? (
        <FAQTable faqs={res.faqs} meta={res.meta} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load FAQs" description={res.message} />
      )}
    </div>
  );
}
