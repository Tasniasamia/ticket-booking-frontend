import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminDashboardAction } from "@/features/dashboard/actions";
import { Empty } from "@/components/dashboard/dashboard-widgets";
import { AdminDashboardView } from "@/components/dashboard/admin/admin-dashboard-view";
import { PageHeader } from "@/components/dashboard/shared/page-header";

export const metadata: Metadata = { title: "Dashboard" };

async function DashboardContent() {
  const data = await getAdminDashboardAction();

  if (!data) {
    return <Empty text="Couldn't load dashboard." />;
  }

  return <AdminDashboardView data={data} />;
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Sales, events and people across TicketBooking."
        className="mb-0"
        actions={
          <Link
            href="/admin/events"
            className="btn-grad flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          >
            <Plus size={16} /> New event
          </Link>
        }
      />

      <Suspense
        fallback={
          <div className="h-96 animate-pulse rounded-3xl bg-fg/10 mt-6" />
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}