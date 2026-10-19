import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/admin/admin-shell";

export const metadata: Metadata = {
  title: { default: "Admin | TicketBooking", template: "%s | Admin" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
