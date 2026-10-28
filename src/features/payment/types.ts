/** Payment list + detail types (backend dto.PaymentResponse) */

export type PaymentStatus = "pending" | "success" | "failed" | "cancelled";

export type PaymentState = PaymentStatus;

export type Localized = Record<string, string>;

export type PaymentUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
  profileImage?: string;
  phoneNumber?: string;
};

export type PaymentEvent = {
  id: number;
  title: Localized | string;
  location?: Localized | string;
  startsAt?: string;
  price?: number;
  currency?: string;
};

export type PaymentBooking = {
  id: number;
  bookingCode: string;
  quantity: number;
  totalPrice: number;
  status: string;
};

export type PaymentItem = {
  id: number;
  bookingId: number;
  userId: number;
  eventId: number;
  amount: number;
  currency: string;
  reason?: string;
  paymentMethod: string;
  status: PaymentStatus;
  transactionId: string;
  bookingCode: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  user?: PaymentUser | null;
  event?: PaymentEvent | null;
  booking?: PaymentBooking | null;
};

export type PaymentSummary = {
  pending: number;
  paid: number;
  total: number;
  currency: string;
};

/** Result-page summary (existing) */
export type PaymentResultSummary = {
  id: number;
  bookingCode: string;
  transactionId: string;
  state: PaymentState;
  method: string;
  amount: number;
  currency: string;
  paidAt: string;
  quantity: number;
  event: { title: Localized; location: Localized; startsAt: string } | null;
};

type Raw = Record<string, unknown>;

const asObj = (v: unknown): Raw => (v && typeof v === "object" ? (v as Raw) : {});

const toLocalized = (v: unknown): Localized =>
  v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v as Raw).map(([k, x]) => [k, String(x ?? "")]))
    : {};

const toState = (v: unknown): PaymentStatus =>
  v === "success" || v === "failed" || v === "cancelled" || v === "pending" ? v : "pending";

export function toPaymentItem(d: Raw): PaymentItem {
  const u = asObj(d.user_info);
  const e = asObj(d.event_info);
  const b = asObj(d.bookings);
  const hasUser = Number(u.id ?? 0) > 0;
  const hasEvent = Number(e.id ?? 0) > 0;
  const hasBooking = Number(b.id ?? 0) > 0 || Boolean(d.booking_code || b.booking_code);

  return {
    id: Number(d.id ?? 0),
    bookingId: Number(d.booking_id ?? b.id ?? 0),
    userId: Number(d.user_id ?? 0),
    eventId: Number(d.event_id ?? e.id ?? 0),
    amount: Number(d.amount ?? 0),
    currency: String(d.currency ?? "BDT"),
    reason: d.reason ? String(d.reason) : undefined,
    paymentMethod: String(d.payment_method ?? ""),
    status: toState(d.status),
    transactionId: String(d.transaction_id ?? ""),
    bookingCode: String(d.booking_code ?? b.booking_code ?? ""),
    paidAt: String(d.paid_at ?? ""),
    createdAt: String(d.created_at ?? ""),
    updatedAt: String(d.updated_at ?? ""),
    user: hasUser
      ? {
          id: Number(u.id),
          name: String(u.name ?? ""),
          email: String(u.email ?? ""),
          role: u.role ? String(u.role) : undefined,
          profileImage: u.profile_image ? String(u.profile_image) : undefined,
          phoneNumber: u.phone_number ? String(u.phone_number) : undefined,
        }
      : null,
    event: hasEvent
      ? {
          id: Number(e.id),
          title: (e.title as Localized) ?? String(e.title ?? ""),
          location: e.location as Localized | string | undefined,
          startsAt: e.starts_at ? String(e.starts_at) : undefined,
          price: e.price != null ? Number(e.price) : undefined,
          currency: e.currency ? String(e.currency) : undefined,
        }
      : null,
    booking: hasBooking
      ? {
          id: Number(b.id ?? d.booking_id ?? 0),
          bookingCode: String(b.booking_code ?? d.booking_code ?? ""),
          quantity: Number(b.quantity ?? 0),
          totalPrice: Number(b.total_price ?? 0),
          status: String(b.status ?? ""),
        }
      : null,
  };
}

export function toPaymentSummary(d: Raw): PaymentResultSummary {
  const b = asObj(d.bookings);
  const e = asObj(d.event_info);
  const hasEvent = Number(e.id ?? 0) > 0;
  return {
    id: Number(d.id ?? 0),
    bookingCode: String(d.booking_code ?? b.booking_code ?? ""),
    transactionId: String(d.transaction_id ?? ""),
    state: toState(d.status),
    method: String(d.payment_method ?? ""),
    amount: Number(d.amount ?? 0),
    currency: String(d.currency ?? "BDT"),
    paidAt: String(d.paid_at ?? ""),
    quantity: Number(b.quantity ?? 0),
    event: hasEvent
      ? {
          title: toLocalized(e.title),
          location: toLocalized(e.location),
          startsAt: String(e.starts_at ?? ""),
        }
      : null,
  };
}

export function toMoneySummary(d: Raw | undefined | null): PaymentSummary {
  if (!d) return { pending: 0, paid: 0, total: 0, currency: "BDT" };
  return {
    pending: Number(d.pending ?? 0),
    paid: Number(d.paid ?? 0),
    total: Number(d.total ?? 0),
    currency: String(d.currency ?? "BDT"),
  };
}
