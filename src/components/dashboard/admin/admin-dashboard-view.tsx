import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { AdminDashboard } from "@/features/dashboard/types";
import { Price } from "@/components/shared/price";
import { LText } from "@/components/shared/localized-text";
import {
  AreaChart, DateChip, Empty, EventThumb, Section, StatCard, StatusBadge, icons,
} from "../dashboard-widgets";

export function AdminDashboardView({ data }: { data: AdminDashboard }) {
  const { Wallet, Ticket, CalendarDays, UserPlus } = icons;
  const cur = data.currency;
  const change = data.revenue.changePct;
  const up = (change ?? 0) >= 0;

  return (
    <div className="space-y-6">
      {/* Revenue: একটা বড় card */}
      <section className="rounded-2xl border border-fg/15 bg-panel/50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-fg/60">Revenue · last 4 weeks</p>
            <p className="mt-2 text-4xl font-bold tabular-nums sm:text-5xl">
              <Price amount={data.revenue.value} from={cur} />
            </p>
            {change != null && (
              <p className={`mt-2 flex items-center gap-1 text-sm ${up ? "text-emerald-400" : "text-rose-400"}`}>
                {up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {up ? "+" : ""}{change.toFixed(1)}%
                <span className="text-fg/50">vs previous 4 weeks</span>
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-fg/60">Last 12 weeks</p>
            <p className="mt-1 text-xl font-semibold tabular-nums"><Price amount={data.revenueTotal} from={cur} /></p>
            <p className="mt-1 text-xs text-fg/50">This week: <Price amount={data.thisWeekRevenue} from={cur} /></p>
          </div>
        </div>
        <div className="mt-4">
          <AreaChart points={data.revenueSeries} />
        </div>
      </section>

      {/* 7 টা card: জোড়া জোড়া পাশাপাশি (events | tickets | users) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total events" value={data.totalEvents.toLocaleString()} hint="Upcoming events" icon={<CalendarDays size={18} />} />
        <StatCard label="Active events" value={data.activeEvents.value.toLocaleString()} changePct={data.activeEvents.changePct} hint="Approved & upcoming" icon={<CalendarDays size={18} />} />
        <StatCard label="Total tickets" value={data.totalTickets.toLocaleString()} hint="Across upcoming events" icon={<Ticket size={18} />} />
        <StatCard label="Tickets sold" value={data.ticketsSold.value.toLocaleString()} changePct={data.ticketsSold.changePct} icon={<Ticket size={18} />} />
        <StatCard label="Total users" value={data.totalUsers.toLocaleString()} icon={<UserPlus size={18} />} />
        {/* <StatCard label="New users" value={data.newUsers.value.toLocaleString()} changePct={data.newUsers.changePct} icon={<UserPlus size={18} />} /> */}
        <StatCard label="Total managers" value={data.totalManagers.toLocaleString()} icon={<Wallet size={18} />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Section title="Recent bookings" subtitle="Latest tickets across all events" className="xl:col-span-2"
          right={<Link href="/admin/bookings" className="text-sm text-coral">View all</Link>}>
          {data.recentBookings.length === 0 ? <Empty text="No bookings yet" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-fg/50">
                  <tr><th className="py-2">Booking</th><th>Customer</th><th>Event</th><th className="text-right">Amount</th><th className="pl-6">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-fg/10">
                  {data.recentBookings.map((b) => (
                    <tr key={b.bookingCode}>
                      <td className="py-3 font-semibold">{b.bookingCode}</td>
                      <td>{b.customer}</td>
                      <td><LText value={b.event} /></td>
                      <td className="text-right font-medium"><Price amount={b.amount} from={b.currency} /></td>
                      <td className="pl-6"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        <Section title="Upcoming events" subtitle="Next on the calendar"
          right={<Link href="/admin/events" className="text-sm text-coral">View all</Link>}>
          {data.upcomingEvents.length === 0 ? <Empty text="No upcoming events" /> : (
            <ul className="divide-y divide-fg/10">
              {data.upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-3">
                  <EventThumb url={e.imageUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium"><LText value={e.title} /></div>
                    <div className="truncate text-xs text-fg/60"><LText value={e.location} /></div>
                    <div className="text-xs text-fg/60">{e.booked.toLocaleString()} going</div>
                  </div>
                  <DateChip iso={e.startsAt} />
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}
