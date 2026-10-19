import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/shared/coming-soon";

export const metadata: Metadata = { title: "Events" };

export default function AdminEventsPage() {
  return <ComingSoon href="/admin/events" />;
}
