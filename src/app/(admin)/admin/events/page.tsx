import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AdminEventTable } from "@/components/dashboard/admin/events/admin-event-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getAdminEventsAction } from "@/features/event/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";

export const metadata: Metadata = { title: "Events" };

async function EventsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["status"]);
  const [langRes, saved] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const res = await getAdminEventsAction(params, lang);

  if (res.success && res.events && res.meta) {
    return <AdminEventTable events={res.events} meta={res.meta} lang={lang} />;
  }
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Could not load events"
      description={res.message}
    />
  );
}

export default function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Review, approve and manage every event on the platform."
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <EventsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
