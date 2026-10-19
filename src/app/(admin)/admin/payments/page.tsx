import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/shared/coming-soon";

export const metadata: Metadata = { title: "Payments" };

export default function AdminPaymentsPage() {
  return <ComingSoon href="/admin/payments" />;
}
