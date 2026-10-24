export const instant=false;
import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/shared/coming-soon";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return <ComingSoon href="/admin/users" />;
}
