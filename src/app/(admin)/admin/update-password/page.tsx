import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { UserTable } from "@/components/dashboard/admin/users/user-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getUsersTableAction } from "@/features/user/actions";
import { UpdatePasswordForm } from "@/components/profile/update-password";

export const metadata: Metadata = { title: "Users" };



export default function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div>

      <UpdatePasswordForm />
    </div>
  );
}
