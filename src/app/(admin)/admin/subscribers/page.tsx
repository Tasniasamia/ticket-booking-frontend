export const instant = false;
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { SubscriberTable } from "@/components/dashboard/admin/subscribe/subscriber-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getSubscriberTableAction } from "@/features/subscribe/actions";

export const metadata: Metadata = { title: "Subscribers" };

export default async function AdminSubscribersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = parseTableParams(await searchParams, [], 10);
  const res = await getSubscriberTableAction(params);
  return (
    <div>
      <PageHeader title="Subscribers" subtitle="Newsletter emails from the public site." />
      {res.success && res.subscribers && res.meta ? (
        <SubscriberTable subscribers={res.subscribers} meta={res.meta} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load subscribers" description={res.message} />
      )}
    </div>
  );
}
