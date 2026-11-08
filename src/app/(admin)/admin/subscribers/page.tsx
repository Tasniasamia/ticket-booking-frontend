import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { SubscriberTable } from "@/components/dashboard/admin/subscribe/subscriber-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getSubscriberTableAction } from "@/features/subscribe/actions";

export const metadata: Metadata = { title: "Subscribers" };

async function SubscribersContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, [], 10);
  const res = await getSubscriberTableAction(params);

  if (res.success && res.subscribers && res.meta) {
    return <SubscriberTable subscribers={res.subscribers} meta={res.meta} />;
  }
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Could not load subscribers"
      description={res.message}
    />
  );
}

export default function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div>
      <PageHeader
        title="Subscribers"
        subtitle="Newsletter emails from the public site."
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <SubscribersContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
