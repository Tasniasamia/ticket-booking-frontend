// Backend এর event/dto.RawResponse কে frontend এর Event এ বদলায়।
// Event এর title/description/location সব language সহ object ({ en, bn }) হিসেবে আসে।

type Raw = Record<string, unknown>;

export type Localized = Record<string, string>;

export type EventStatus = "pending" | "approved" | "canceled";
export const EVENT_STATUSES: EventStatus[] = ["pending", "approved", "canceled"];

/** Backend এর media.MediaImage: { id, url } */
export type EventImage = { id: number; url: string };

export type EventCategoryInfo = { id: number; name: Localized };

export type EventManagerInfo = {
  id: number;
  name: string;
  email: string;
  designation: string;
  phone: string;
};

export type EventItem = {
  id: number;
  title: Localized;
  description: Localized;
  location: Localized;
  starts_at: string; // ISO
  total_tickets: number;
  available_tickets: number;
  price: number;
  currency: string;
  status: EventStatus;
  created_at: string;
  category_id: number;
  category: EventCategoryInfo | null;
  manager_id: number;
  manager: EventManagerInfo | null;
  thumbnail: EventImage | null;
  images: EventImage[];
};

const toLocalized = (v: unknown): Localized =>
  v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v as Raw).map(([k, x]) => [k, String(x ?? "")]))
    : {};

const toImage = (v: unknown): EventImage | null => {
  if (!v || typeof v !== "object") return null;
  const o = v as Raw;
  const url = String(o.url ?? "");
  return url ? { id: Number(o.id ?? 0), url } : null;
};

const toStatus = (v: unknown): EventStatus =>
  EVENT_STATUSES.includes(v as EventStatus) ? (v as EventStatus) : "pending";

export function toEvent(d: Raw): EventItem {
  const cat = d.category as Raw | null | undefined;
  const mgr = d.manager as Raw | null | undefined;

  return {
    id: Number(d.id),
    title: toLocalized(d.title),
    description: toLocalized(d.description),
    location: toLocalized(d.location),
    starts_at: String(d.starts_at ?? ""),
    total_tickets: Number(d.total_tickets ?? 0),
    available_tickets: Number(d.available_tickets ?? 0),
    price: Number(d.price ?? 0),
    currency: String(d.currency ?? "BDT"),
    status: toStatus(d.status),
    created_at: String(d.created_at ?? ""),
    category_id: Number(d.category_id ?? 0),
    category: cat ? { id: Number(cat.id), name: toLocalized(cat.name) } : null,
    manager_id: Number(d.manager_id ?? 0),
    manager: mgr
      ? {
          id: Number(mgr.id),
          name: String(mgr.name ?? ""),
          email: String(mgr.email ?? ""),
          designation: String(mgr.designation ?? ""),
          phone: String(mgr.phone_number ?? ""),
        }
      : null,
    thumbnail: toImage(d.thumbnail_image),
    images: Array.isArray(d.images) ? (d.images.map(toImage).filter(Boolean) as EventImage[]) : [],
  };
}
