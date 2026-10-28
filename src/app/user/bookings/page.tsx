import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { BookingTable } from "@/components/dashboard/bookings/booking-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
// import { getMyBookingsAction } from "@/features/booking/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";
import { getMyBookingsAction } from "@/features/booking/actions";

export const metadata: Metadata = { title: "My Bookings" };

export default async function UserBookingsPage() {
  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const res = await getMyBookingsAction();

  if (!res.success || !res.bookings || !res.meta) {
    return (
      <EmptyState icon={AlertTriangle} title="Could not load bookings" description={res.message} />
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">My bookings</h2>
      <BookingTable
        bookings={res.bookings}
        meta={res.meta}
        lang={lang}
        showUser={false}
        showEvent
        enableFilters={false}
      />
    </div>
  );
}
