export const instant = false;
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { UserTable } from "@/components/dashboard/admin/users/user-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getManagersTableAction } from "@/features/user/actions";

export const metadata: Metadata = { title: "Managers" };

export default async function AdminManagersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = parseTableParams(await searchParams, ["status"], 10);
  const res = await getManagersTableAction(params);
  return (
    <div>
      <PageHeader title="Managers" subtitle="Event managers, their verification and status." />
      {res.success && res.users && res.meta ? (
        <UserTable users={res.users} meta={res.meta} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load managers" description={res.message} />
      )}
    </div>
  );
}
