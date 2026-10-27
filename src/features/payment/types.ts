type Raw = Record<string, unknown>;
type Localized = Record<string, string>;

export type PaymentState = "success" | "pending" | "failed" | "cancelled";

/** Backend dto.PaymentResponse থেকে result page এর যা লাগে */
export type PaymentSummary = {
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

const toLocalized = (v: unknown): Localized =>
  v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v as Raw).map(([k, x]) => [k, String(x ?? "")]))
    : {};

const toState = (v: unknown): PaymentState =>
  v === "success" || v === "failed" || v === "cancelled" ? v : "pending";

export function toPaymentSummary(d: Raw): PaymentSummary {
  const b = (d.bookings ?? {}) as Raw;
  const e = (d.event_info ?? {}) as Raw;
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
    event: hasEvent ? { title: toLocalized(e.title), location: toLocalized(e.location), startsAt: String(e.starts_at ?? "") } : null,
  };
}
