export const instant=false;
import { Suspense } from "react";
import { getManagerDashboardAction } from "@/features/dashboard/actions";
import { ManagerDashboardView } from "@/components/dashboard/manager/manager-dashboard-view";
import { Empty } from "@/components/dashboard/dashboard-widgets";

async function DashboardContent() {
  const data = await getManagerDashboardAction();
  return data ? <ManagerDashboardView data={data} /> : <Empty text="Couldn't load dashboard." />;
}

export default function ManagerDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}