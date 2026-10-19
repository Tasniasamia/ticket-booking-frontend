import { ADMIN_ITEMS } from "@/components/dashboard/admin/admin-menu";
import { PageHeader } from "./page-header";

/** যে section এর page এখনো বানানো হয়নি, সেখানে এটা দেখায়। শিরোনাম আসে admin-menu থেকে। */
export function ComingSoon({ href }: { href: string }) {
  const item = ADMIN_ITEMS.find((i) => i.href === href);
  if (!item) return null;
  const Icon = item.icon;

  return (
    <>
      <PageHeader title={item.title} subtitle={item.subtitle} />
      <div className="grid place-items-center rounded-3xl border border-dashed border-fg/20 bg-panel/40 px-6 py-20 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-fg/10">
          <Icon className="size-6 text-coral" />
        </span>
        <h2 className="mt-5 text-lg font-bold">Nothing to show yet</h2>
        <p className="mt-2 max-w-sm text-sm text-fg/60">
          This section is not connected to the backend yet. It will appear here once it is ready.
        </p>
      </div>
    </>
  );
}
