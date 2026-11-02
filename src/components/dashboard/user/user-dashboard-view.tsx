import Link from "next/link";
import type { UserDashboard } from "@/features/dashboard/types";
import { Price } from "@/components/shared/price";
import { LText } from "@/components/shared/localized-text";
import { LocalTime } from "@/components/dashboard/events/local-time";
import { DateChip, Empty, EventThumb, Section, StatCard, icons } from "../dashboard-widgets";

export function UserDashboardView({ data }: { data: UserDashboard }) {
  const { Wallet, Ticket, CalendarDays } = icons;
  const s = data.stats;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total paid" value={<Price amount={s.totalPaid} from={data.currency} />} icon={<Wallet size={18} />} />
        <StatCard label="Events paid for" value={String(s.paidEvents)} icon={<Ticket size={18} />} />
        <StatCard label="Upcoming, not paid yet" value={String(s.unpaidUpcoming)} icon={<CalendarDays size={18} />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Your upcoming events" subtitle="Tickets you've paid for"
          right={<Link href="/user/bookings" className="text-sm text-coral">My bookings</Link>}>
          {data.upcomingEvents.length === 0 ? <Empty text="No upcoming paid events" /> : (
            <ul className="divide-y divide-fg/10">
              {data.upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-3">
                  <EventThumb url={e.imageUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium"><LText value={e.title} /></div>
                    <div className="truncate text-xs text-fg/60"><LText value={e.location} /></div>
                    <div className="text-xs text-fg/50">{e.quantity} ticket{e.quantity === 1 ? "" : "s"} · {e.bookingCode}</div>
                  </div>
                  <DateChip iso={e.startsAt} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Recent payments" subtitle="Your latest paid transactions"
          right={<Link href="/user/payments" className="text-sm text-coral">View all</Link>}>
          {data.payments.length === 0 ? <Empty text="No payments yet" /> : (
            <ul className="divide-y divide-fg/10">
              {data.payments.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium"><LText value={t.eventTitle} /></div>
                    <div className="text-xs text-fg/50">{t.bookingCode} · <LocalTime iso={t.paidAt} format="DD MMM YYYY" /></div>
                  </div>
                  <span className="font-semibold text-emerald-400"><Price amount={t.amount} from={t.currency} /></span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section title="Waiting for payment" subtitle="Upcoming events you booked but haven't paid for yet">
        {data.unpaidUpcoming.length === 0 ? <Empty text="Nothing pending 🎉" /> : (
          <ul className="divide-y divide-fg/10">
            {data.unpaidUpcoming.map((b) => (
              <li key={b.bookingId} className="flex flex-wrap items-center gap-3 py-3">
                <DateChip iso={b.startsAt} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium"><LText value={b.eventTitle} /></div>
                  <div className="truncate text-xs text-fg/60">
                    <LText value={b.location} /> · {b.quantity} ticket{b.quantity === 1 ? "" : "s"} · {b.bookingCode}
                  </div>
                </div>
                <span className="font-semibold"><Price amount={b.amount} from={b.currency} /></span>
                <Link href="/user/bookings" className="btn-grad rounded-full px-4 py-1.5 text-xs font-medium">
                  View booking
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
