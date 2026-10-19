import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/shared/coming-soon";

export const metadata: Metadata = { title: "Bookings" };

export default function AdminBookingsPage() {
  return <ComingSoon href="/admin/bookings" />;
}
