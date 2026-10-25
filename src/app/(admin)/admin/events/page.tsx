import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AdminEventTable } from "@/components/dashboard/admin/events/admin-event-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getAdminEventsAction } from "@/features/event/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/pick-language";
import { getLanguageCookie } from "@/lib/preferences";

export const metadata: Metadata = { title: "Events" };

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // "status" ই একমাত্র filter, ?status=pending
  const params = parseTableParams(await searchParams, ["status"]);

  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  const res = await getAdminEventsAction(params, lang);

  return (
    <div>
      <PageHeader title="Events" subtitle="Review, approve and manage every event on the platform." />
      {res.success && res.events && res.meta ? (
        <AdminEventTable events={res.events} meta={res.meta} lang={lang} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load events" description={res.message} />
      )}
    </div>
  );
}
