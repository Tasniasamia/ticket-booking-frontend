import { getManagerDashboardAction } from "@/features/dashboard/actions";
import { ManagerDashboardView } from "@/components/dashboard/manager/manager-dashboard-view";
import { Empty } from "@/components/dashboard/dashboard-widgets";

export default async function ManagerDashboardPage() {
  const data = await getManagerDashboardAction();
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      {data ? <ManagerDashboardView data={data} /> : <Empty text="Couldn't load dashboard." />}
    </div>
  );
}
