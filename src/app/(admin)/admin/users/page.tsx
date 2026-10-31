export const instant = false;
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { UserTable } from "@/components/dashboard/admin/users/user-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getUsersTableAction } from "@/features/user/actions";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = parseTableParams(await searchParams, ["role", "status"], 10);
  const res = await getUsersTableAction(params);
  return (
    <div>
      <PageHeader title="Users" subtitle="Everyone with an account, with their role and status." />
      {res.success && res.users && res.meta ? (
        <UserTable users={res.users} meta={res.meta} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load users" description={res.message} />
      )}
    </div>
  );
}
