import Link from "next/link";
import type { ManagerDashboard } from "@/features/dashboard/types";
import { Price } from "@/components/shared/price";
import { LText } from "@/components/shared/localized-text";
import { LocalTime } from "@/components/dashboard/events/local-time";
import {
  DateChip, Empty, EventThumb, SeatBar, Section, StatCard, StatusBadge, icons,
} from "../dashboard-widgets";

export function ManagerDashboardView({ data }: { data: ManagerDashboard }) {
  const { CalendarDays, Wallet, CircleDollarSign, Armchair, Ticket } = icons;
  const s = data.stats;
  const cur = data.currency;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <StatCard label="My events" value={String(s.totalEvents)} hint={`${s.upcomingEvents} upcoming`} icon={<CalendarDays size={18} />} />
        <StatCard label="Paid (upcoming events)" value={<Price amount={s.upcomingPaid} from={cur} />} hint="Already received" icon={<Wallet size={18} />} />
        <StatCard label="Potential earnings" value={<Price amount={s.upcomingPotential} from={cur} />} hint="If every upcoming seat is sold" icon={<CircleDollarSign size={18} />} />
        <StatCard label="Seats available" value={s.seatsAvailable.toLocaleString()} hint={`of ${s.seatsTotal.toLocaleString()} seats in upcoming events`} icon={<Armchair size={18} />} />
        <StatCard label="Bookings (upcoming)" value={s.bookingsCount.toLocaleString()} hint="Active bookings on upcoming events" icon={<Ticket size={18} />} />
        <StatCard label="Total paid" value={<Price amount={s.totalPaid} from={cur} />} hint="All events, lifetime" icon={<Wallet size={18} />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Upcoming events" subtitle="Your next 4 events"
          right={<Link href="/manager/events" className="text-sm text-coral">View all</Link>}>
          {data.upcomingEvents.length === 0 ? <Empty text="No upcoming events" /> : (
            <ul className="divide-y divide-fg/10">
              {data.upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-3">
                  <EventThumb url={e.imageUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium"><LText value={e.title} /></span>
                      {e.status !== "approved" && <StatusBadge status={e.status} />}
                    </div>
                    <div className="text-xs text-fg/60">
                      {e.booked} booked · {e.availableSeats} available · <Price amount={e.paidAmount} from="BDT" /> paid
                    </div>
                    <SeatBar booked={e.booked} total={e.totalSeats} />
                  </div>
                  <DateChip iso={e.startsAt} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Recent paid transactions" subtitle="Payments received on your events">
          {data.transactions.length === 0 ? <Empty text="No paid transactions yet" /> : (
            <ul className="divide-y divide-fg/10">
              {data.transactions.map((t) => (
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
    </div>
  );
}
