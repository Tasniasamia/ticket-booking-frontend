import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminOverview } from "@/components/dashboard/admin/admin-overview";
import { PageHeader } from "@/components/dashboard/shared/page-header";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Sales, events and people across TicketBooking."
        actions={
          <Link
            href="/admin/events"
            className="btn-grad inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-coral"
          >
            <Plus className="size-4" />
            New event
          </Link>
        }
      />
      <AdminOverview />
    </>
  );
}
