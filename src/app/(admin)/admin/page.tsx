import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminDashboardAction } from "@/features/dashboard/actions";
import { Empty } from "@/components/dashboard/dashboard-widgets";
import { AdminDashboardView } from "@/components/dashboard/admin/admin-dashboard-view";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardAction();
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-fg/60">Sales, events and people across TicketBooking.</p>
        </div>
        <Link href="/admin/events" className="btn-grad flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
          <Plus size={16} /> New event
        </Link>
      </div>
      {data ? <AdminDashboardView data={data} /> : <Empty text="Couldn't load dashboard." />}
    </div>
  );
}
