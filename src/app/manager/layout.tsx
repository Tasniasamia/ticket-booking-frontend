export const instant = false;


import type { Metadata } from "next";
import { ManagerShell } from "@/components/dashboard/manager/manager-shell";


export const metadata: Metadata = {
  title: { default: "Manager | TicketBooking", template: "%s | Manager" },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div suppressHydrationWarning><ManagerShell>{children}</ManagerShell></div>;
}
