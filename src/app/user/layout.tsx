import type { Metadata } from "next";
import { UserShell } from "@/components/dashboard/user/user-shell";

export const instant = false;

export const metadata: Metadata = {
  title: { default: "User | TicketBooking", template: "%s | User" },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div suppressHydrationWarning><UserShell>{children}</UserShell></div>;
}
