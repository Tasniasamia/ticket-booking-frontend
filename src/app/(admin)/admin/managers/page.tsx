import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/shared/coming-soon";

export const metadata: Metadata = { title: "Managers" };

export default function AdminManagersPage() {
  return <ComingSoon href="/admin/managers" />;
}
