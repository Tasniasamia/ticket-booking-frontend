/* eslint-disable @typescript-eslint/no-explicit-any */
// API payload -> UI types. snake_case শুধু এই file এ।
//
// টাকার অংক সব `currency` (BDT) এ আসে; দেখানোর সময় <Price amount from={currency} /> user এর currency তে বদলে দেয়।
// ব্যতিক্রম: recentBookings / unpaidUpcoming / transactions এর নিজের `currency` আছে (event এর currency)।

export type Localized = Record<string, string>;

export type Stat = { value: number; changePct: number | null };
export type RevenuePoint = { week: string; amount: number };

export type UpcomingEvent = {
  id: number; title: Localized; location: Localized; imageUrl: string; startsAt: string; status: string;
  totalSeats: number; availableSeats: number; booked: number; paidAmount: number;
};
export type RecentBooking = {
  bookingCode: string; customer: string; event: Localized; amount: number; currency: string;
  status: "paid" | "pending" | "failed" | "cancelled" | string; createdAt: string;
};
export type Transaction = {
  id: number; bookingCode: string; eventTitle: Localized; amount: number; currency: string; paidAt: string;
};
export type UserEvent = {
  id: number; title: Localized; location: Localized; imageUrl: string; startsAt: string;
  bookingCode: string; quantity: number;
};
export type UnpaidBooking = {
  bookingId: number; bookingCode: string; eventId: number; eventTitle: Localized; location: Localized;
  startsAt: string; quantity: number; amount: number; currency: string;
};

export type AdminDashboard = {
  currency: string;
  revenue: Stat; ticketsSold: Stat; activeEvents: Stat; newUsers: Stat;
  totalEvents: number; totalTickets: number; totalUsers: number; totalManagers: number;
  revenueSeries: RevenuePoint[]; revenueTotal: number; thisWeekRevenue: number;
  upcomingEvents: UpcomingEvent[]; recentBookings: RecentBooking[];
};
export type ManagerDashboard = {
  currency: string;
  stats: {
    totalEvents: number; upcomingEvents: number; totalPaid: number; upcomingPaid: number;
    upcomingPotential: number; seatsTotal: number; seatsAvailable: number; bookingsCount: number;
  };
  upcomingEvents: UpcomingEvent[]; transactions: Transaction[];
};
export type UserDashboard = {
  currency: string;
  stats: { totalPaid: number; paidEvents: number; unpaidUpcoming: number };
  upcomingEvents: UserEvent[]; payments: Transaction[]; unpaidUpcoming: UnpaidBooking[];
};

const n = (v: any) => Number(v ?? 0);
const s = (v: any) => String(v ?? "");
const cur = (v: any) => s(v) || "BDT";
const loc = (v: any): Localized =>
  v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, s(x)])) : {};
const stat = (x: any): Stat => ({ value: n(x?.value), changePct: x?.change_pct ?? null });

const toUpcoming = (e: any): UpcomingEvent => ({
  id: n(e.id), title: loc(e.title), location: loc(e.location), imageUrl: s(e.image_url), startsAt: s(e.starts_at),
  status: s(e.status), totalSeats: n(e.total_seats), availableSeats: n(e.available_seats),
  booked: n(e.booked), paidAmount: n(e.paid_amount),
});
const toTx = (t: any): Transaction => ({
  id: n(t.id), bookingCode: s(t.booking_code), eventTitle: loc(t.event_title),
  amount: n(t.amount), currency: cur(t.currency), paidAt: s(t.paid_at),
});

export const toAdminDashboard = (d: any): AdminDashboard => ({
  currency: cur(d.currency),
  revenue: stat(d.revenue), ticketsSold: stat(d.tickets_sold), activeEvents: stat(d.active_events), newUsers: stat(d.new_users),
  totalEvents: n(d.total_events), totalTickets: n(d.total_tickets),
  totalUsers: n(d.total_users), totalManagers: n(d.total_managers),
  revenueSeries: (d.revenue_series ?? []).map((p: any) => ({ week: s(p.week), amount: n(p.amount) })),
  revenueTotal: n(d.revenue_total), thisWeekRevenue: n(d.this_week_revenue),
  upcomingEvents: (d.upcoming_events ?? []).map(toUpcoming),
  recentBookings: (d.recent_bookings ?? []).map((b: any) => ({
    bookingCode: s(b.booking_code), customer: s(b.customer), event: loc(b.event),
    amount: n(b.amount), currency: cur(b.currency), status: s(b.status), createdAt: s(b.created_at),
  })),
});

export const toManagerDashboard = (d: any): ManagerDashboard => ({
  currency: cur(d.currency),
  stats: {
    totalEvents: n(d.stats?.total_events), upcomingEvents: n(d.stats?.upcoming_events),
    totalPaid: n(d.stats?.total_paid), upcomingPaid: n(d.stats?.upcoming_paid),
    upcomingPotential: n(d.stats?.upcoming_potential), seatsTotal: n(d.stats?.seats_total),
    seatsAvailable: n(d.stats?.seats_available), bookingsCount: n(d.stats?.bookings_count),
  },
  upcomingEvents: (d.upcoming_events ?? []).map(toUpcoming),
  transactions: (d.transactions ?? []).map(toTx),
});

export const toUserDashboard = (d: any): UserDashboard => ({
  currency: cur(d.currency),
  stats: {
    totalPaid: n(d.stats?.total_paid), paidEvents: n(d.stats?.paid_events), unpaidUpcoming: n(d.stats?.unpaid_upcoming),
  },
  upcomingEvents: (d.upcoming_events ?? []).map((e: any): UserEvent => ({
    id: n(e.id), title: loc(e.title), location: loc(e.location), imageUrl: s(e.image_url),
    startsAt: s(e.starts_at), bookingCode: s(e.booking_code), quantity: n(e.quantity),
  })),
  payments: (d.payments ?? []).map(toTx),
  unpaidUpcoming: (d.unpaid_upcoming ?? []).map((b: any): UnpaidBooking => ({
    bookingId: n(b.booking_id), bookingCode: s(b.booking_code), eventId: n(b.event_id),
    eventTitle: loc(b.event_title), location: loc(b.location), startsAt: s(b.starts_at),
    quantity: n(b.quantity), amount: n(b.amount), currency: cur(b.currency),
  })),
});
