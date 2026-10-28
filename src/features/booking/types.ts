/** Booking status from backend dto.BookingStatus */
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type BookingUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  phoneNumber?: string;
  country?: string;
};

export type BookingEvent = {
  id: number;
  title: Record<string, string> | string;
  location?: Record<string, string> | string;
  startsAt?: string;
  price?: number;
  currency?: string;
  thumbnailUrl?: string;
};

export type BookingItem = {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  bookingCode: string;
  createdAt: string;
  user?: BookingUser | null;
  event?: BookingEvent | null;
};

type Raw = Record<string, unknown>;

const asObj = (v: unknown): Raw => (v && typeof v === "object" ? (v as Raw) : {});

/** gorm.Model / dto — id বা ID দুটোই আসতে পারে */
const numId = (o: Raw, ...keys: string[]) => {
  for (const k of keys) {
    const v = o[k];
    if (v != null && v !== "") {
      const n = Number(v);
      if (!Number.isNaN(n) && n > 0) return n;
    }
  }
  return 0;
};

const toLocalized = (v: unknown): Record<string, string> | string => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Raw).map(([k, x]) => [k, String(x ?? "")]),
    );
  }
  return String(v);
};

/**
 * Real API shape (GET /bookings):
 * - booking: id, user_id, event_id, quantity, total_price, status, booking_code, created_at
 * - user_info: id, name, email, role, profile_image, ...
 * - event_info: ID (capital!), title{en,bn}, location, starts_at, price, currency, thumbnail_image
 */
export function toBooking(d: Raw): BookingItem {
  const u = asObj(d.user_info);
  const e = asObj(d.event_info);

  const userId = numId(u, "id", "ID");
  const eventId = numId(e, "id", "ID") || numId(d, "event_id");

  const thumb = asObj(e.thumbnail_image);

  return {
    id: Number(d.id ?? 0),
    userId: Number(d.user_id ?? userId ?? 0),
    eventId: Number(d.event_id ?? eventId ?? 0),
    quantity: Number(d.quantity ?? 0),
    totalPrice: Number(d.total_price ?? 0),
    status: (String(d.status ?? "pending") as BookingStatus) || "pending",
    bookingCode: String(d.booking_code ?? ""),
    createdAt: String(d.created_at ?? ""),
    user:
      userId > 0
        ? {
            id: userId,
            name: String(u.name ?? ""),
            email: String(u.email ?? ""),
            role: String(u.role ?? ""),
            profileImage: u.profile_image ? String(u.profile_image) : undefined,
            phoneNumber: u.phone_number ? String(u.phone_number) : undefined,
            country: u.country ? String(u.country) : undefined,
          }
        : null,
    event:
      eventId > 0
        ? {
            id: eventId,
            title: toLocalized(e.title),
            location: toLocalized(e.location),
            startsAt: e.starts_at != null ? String(e.starts_at) : undefined,
            price: e.price != null ? Number(e.price) : undefined,
            currency: e.currency != null ? String(e.currency) : "BDT",
            thumbnailUrl: thumb.url ? String(thumb.url) : undefined,
          }
        : null,
  };
}