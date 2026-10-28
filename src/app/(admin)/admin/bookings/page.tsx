import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { BookingTable } from "@/components/dashboard/bookings/booking-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getAdminBookingsAction } from "@/features/booking/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";

export const metadata: Metadata = { title: "Bookings" };

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["status"]);
  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const res = await getAdminBookingsAction(params);

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="All ticket bookings across the platform, with dates and status."
      />
      {res.success && res.bookings && res.meta ? (
        <BookingTable
          bookings={res.bookings}
          meta={res.meta}
          lang={lang}
          showUser
          showEvent
          enableFilters
        />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load bookings" description={res.message} />
      )}
    </div>
  );
}
