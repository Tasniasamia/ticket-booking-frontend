import { getUserDashboardAction } from "@/features/dashboard/actions";
import { UserDashboardView } from "@/components/dashboard/user/user-dashboard-view";
import { Empty } from "@/components/dashboard/dashboard-widgets";

export default async function UserDashboardPage() {
  const data = await getUserDashboardAction();
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">My dashboard</h1>
      {data ? <UserDashboardView data={data} /> : <Empty text="Couldn't load dashboard." />}
    </div>
  );
}
