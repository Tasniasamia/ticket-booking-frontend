// type Raw = Record<string, unknown>;
// type Localized = Record<string, unknown>;

// // backend object, JSON string, ba plain string, jai pathak object e bodle dey
// const toLocalized = (v: unknown): Localized => {
//   if (v == null || v === "") return {};
//   if (typeof v === "object") return v as Localized;
//   if (typeof v === "string") {
//     try {
//       const parsed = JSON.parse(v);
//       if (parsed && typeof parsed === "object") return parsed as Localized;
//     } catch {
//       /* JSON na, plain text */
//     }
//     return { en: v };
//   }
//   return { en: String(v) };
// };

// export type EventCategory = {
//   id: number;
//   name: Localized;
//   description: Localized;
//   event_category_image_url: string;
//   event_category_image_id: number;
//   created_at: string;
//   updated_at: string;
// };

// export function toEventCategory(d: Raw): EventCategory {
//   return {
//     id: Number(d.id),
//     name: toLocalized(d.name),
//     description: toLocalized(d.description),
//     event_category_image_url: String(d.event_category_image_url ?? ""),
//     event_category_image_id: Number(d.event_category_image_id ?? 0),
//     created_at: String(d.created_at ?? ""),
//     updated_at: String(d.updated_at ?? ""),
//   };
// }


type Raw = Record<string, unknown>;
export type Localized = Record<string, string>;

const base = (d: Raw) => ({
  id: Number(d.id),
  event_category_image_url: String(d.event_category_image_url ?? ""),
  event_category_image_id: Number(d.event_category_image_id ?? 0),
  created_at: String(d.created_at ?? ""),
  updated_at: String(d.updated_at ?? ""),
});

// Table এর জন্য: backend এক language এর string পাঠায়
export type EventCategoryListItem = ReturnType<typeof base> & {
  name: string;
  description: string;
};

export const toEventCategoryListItem = (d: Raw): EventCategoryListItem => ({
  ...base(d),
  name: String(d.name ?? ""),
  description: String(d.description ?? ""),
});

// Edit এর জন্য: সব language সহ object
export type EventCategory = ReturnType<typeof base> & {
  name: Localized;
  description: Localized;
};

const toLocalized = (v: unknown): Localized =>
  v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v as Raw).map(([k, x]) => [k, String(x ?? "")]))
    : {};

export const toEventCategory = (d: Raw): EventCategory => ({
  ...base(d),
  name: toLocalized(d.name),
  description: toLocalized(d.description),
});