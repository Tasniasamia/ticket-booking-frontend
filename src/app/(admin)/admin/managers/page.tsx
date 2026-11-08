import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { UserTable } from "@/components/dashboard/admin/users/user-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getManagersTableAction } from "@/features/user/actions";

export const metadata: Metadata = { title: "Managers" };

async function ManagersContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["status"], 10);
  const res = await getManagersTableAction(params);

  if (res.success && res.users && res.meta) {
    return <UserTable users={res.users} meta={res.meta} />;
  }
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Could not load managers"
      description={res.message}
    />
  );
}

export default function AdminManagersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div>
      <PageHeader
        title="Managers"
        subtitle="Event managers, their verification and status."
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <ManagersContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
