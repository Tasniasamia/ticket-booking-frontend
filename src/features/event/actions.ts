// "use server";

// import { z } from "zod";
// import { getErrorMessage } from "@/features/auth/service";
// import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
// import type { ActionResult } from "@/components/common/table/data-table";
// import { toEvent, type EventItem, type EventStatus } from "./types";
// import { eventSchema, type EventFormValues } from "./schemas";
// import {
//   createEventRequest,
//   deleteEventRequest,
//   listAdminEventsRequest,
//   listMyEventsRequest,
//   listUpcomingEventsRequest,
//   updateEventRequest,
//   updateEventStatusRequest,
//   type EventPayload,
// } from "./service";

// /* ---------- List ---------- */

// export type EventTableResult = {
//   success: boolean;
//   message?: string;
//   events?: EventItem[];
//   meta?: PaginationMeta;
// };

// /** Admin: সব event (status filter আর search সহ) */
// export async function getAdminEventsAction(params: TableParams, lang: string): Promise<EventTableResult> {
//   try {
//     const res = await listAdminEventsRequest(toApiParams(params), lang);
//     const { docs, ...meta } = res.data.data;
//     return { success: true, events: docs.map(toEvent), meta };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }

// /** Manager: নিজের event */
// export async function getMyEventsAction(params: TableParams, lang: string): Promise<EventTableResult> {
//   try {
//     const res = await listMyEventsRequest(toApiParams(params), lang);
//     const { docs, ...meta } = res.data.data;
//     return { success: true, events: docs.map(toEvent), meta };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }

// /* ---------- Create / Update ---------- */

// export type EventFormResult = ActionResult & { fieldErrors?: Record<string, string[] | undefined> };

// const invalid = (error: z.ZodError): EventFormResult => ({
//   success: false,
//   message: "Please check the form.",
//   fieldErrors: z.flattenError(error).fieldErrors,
// });

// // ফাঁকা language বাদ দিই
// const clean = (r: Record<string, string>) =>
//   Object.fromEntries(Object.entries(r).filter(([, v]) => v.trim() !== ""));

// // starts_at এখানে আগেই ISO (UTC) তে আসে, EventForm browser এ বানিয়ে পাঠায়, তাই user এর timezone ঠিক থাকে।
// const toPayload = (v: EventFormValues) => ({
//   title: clean(v.title),
//   description: clean(v.description),
//   location: clean(v.location),
//   starts_at: v.starts_at,
//   price: v.price,
//   currency: v.currency.toUpperCase(),
//   category_id: Number(v.category_id),
//   thumbnail_image: { id: v.thumbnail_id, url: v.thumbnail_url },
//   images: v.images,
// });

// export async function createEventAction(input: EventFormValues): Promise<EventFormResult> {
//   const parsed = eventSchema.safeParse(input);
//   if (!parsed.success) return invalid(parsed.error);
//   const payload: EventPayload = { ...toPayload(parsed.data), total_tickets: parsed.data.total_tickets };
//   try {
//     await createEventRequest(payload);
//     return { success: true, message: "Event submitted. It will show publicly once an admin approves it." };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }

// export async function updateEventAction(id: number, input: EventFormValues): Promise<EventFormResult> {
//   const parsed = eventSchema.safeParse(input);
//   if (!parsed.success) return invalid(parsed.error);
//   try {
//     await updateEventRequest(id, toPayload(parsed.data));
//     return { success: true, message: "Event updated." };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }

// /* ---------- Delete / Status ---------- */

// export async function deleteEventAction(id: string | number): Promise<ActionResult> {
//   try {
//     await deleteEventRequest(id);
//     return { success: true, message: "Event deleted." };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }

// /** Admin: pending → approved / canceled */
// export async function updateEventStatusAction(eventId: number, status: EventStatus): Promise<ActionResult> {
//   try {
//     await updateEventStatusRequest(eventId, status);
//     return { success: true, message: `Event ${status}.` };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }

// export async function getUpcomingEventsAction(limit = 10) {
//   try {
//     const res = await listUpcomingEventsRequest(limit);
//     return { success: true, events: res.data };
//   } catch (err) {
//     return { success: false, message: getErrorMessage(err) };
//   }
// }


"use server";

import axios from "axios";
import { z } from "zod";
import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { toEvent, type EventItem, type EventStatus } from "./types";
import { eventSchema, type EventFormValues } from "./schemas";
import {
  createEventRequest,
  deleteEventRequest,
  listAdminEventsRequest,
  getPublicEventRequest,
  listMyEventsRequest,
  listPublicEventsRequest,
  listUpcomingEventsRequest,
  updateEventRequest,
  updateEventStatusRequest,
  type EventPayload,
} from "./service";

/* ---------- List ---------- */

export type EventTableResult = {
  success: boolean;
  message?: string;
  events?: EventItem[];
  meta?: PaginationMeta;
};

/** Admin: সব event (status filter আর search সহ) */
export async function getAdminEventsAction(params: TableParams, lang: string): Promise<EventTableResult> {
  try {
    const res = await listAdminEventsRequest(toApiParams(params), lang);
    const { docs, ...meta } = res.data.data;
    return { success: true, events: docs.map(toEvent), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/** Manager: নিজের event */
export async function getMyEventsAction(params: TableParams, lang: string): Promise<EventTableResult> {
  try {
    const res = await listMyEventsRequest(toApiParams(params), lang);
    const { docs, ...meta } = res.data.data;
    return { success: true, events: docs.map(toEvent), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/* ---------- Create / Update ---------- */

export type EventFormResult = ActionResult & { fieldErrors?: Record<string, string[] | undefined> };

const invalid = (error: z.ZodError): EventFormResult => ({
  success: false,
  message: "Please check the form.",
  fieldErrors: z.flattenError(error).fieldErrors,
});

// ফাঁকা language বাদ দিই
const clean = (r: Record<string, string>) =>
  Object.fromEntries(Object.entries(r).filter(([, v]) => v.trim() !== ""));

// starts_at এখানে আগেই ISO (UTC) তে আসে, EventForm browser এ বানিয়ে পাঠায়, তাই user এর timezone ঠিক থাকে।
const toPayload = (v: EventFormValues) => ({
  title: clean(v.title),
  description: clean(v.description),
  location: clean(v.location),
  starts_at: v.starts_at,
  price: v.price,
  currency: v.currency.toUpperCase(),
  category_id: Number(v.category_id),
  thumbnail_image: { id: v.thumbnail_id, url: v.thumbnail_url },
  images: v.images,
});

export async function createEventAction(input: EventFormValues): Promise<EventFormResult> {
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const payload: EventPayload = { ...toPayload(parsed.data), total_tickets: parsed.data.total_tickets };
  try {
    await createEventRequest(payload);
    return { success: true, message: "Event submitted. It will show publicly once an admin approves it." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function updateEventAction(id: number, input: EventFormValues): Promise<EventFormResult> {
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await updateEventRequest(id, toPayload(parsed.data));
    return { success: true, message: "Event updated." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/* ---------- Delete / Status ---------- */

export async function deleteEventAction(id: string | number): Promise<ActionResult> {
  try {
    await deleteEventRequest(id);
    return { success: true, message: "Event deleted." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/** Admin: pending → approved / canceled */
export async function updateEventStatusAction(eventId: number, status: EventStatus): Promise<ActionResult> {
  try {
    await updateEventStatusRequest(eventId, status);
    return { success: true, message: `Event ${status}.` };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function getUpcomingEventsAction(limit = 10) {
  try {
    const res = await listUpcomingEventsRequest(limit);
    return { success: true, events: res.data };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/* ---------- Public website ---------- */

export type PublicEventsResult = { success: boolean; message?: string; events?: EventItem[]; meta?: PaginationMeta };

/** /events page: search + category_id filter + pagination, সব backend এই হয়। */
export async function getPublicEventsAction(params: TableParams, lang: string): Promise<PublicEventsResult> {
  try {
    const res = await listPublicEventsRequest(toApiParams(params), lang);
    const { docs, ...meta } = res.data.data;
    return { success: true, events: docs.map(toEvent), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type PublicEventResult = { success: boolean; message?: string; notFound?: boolean; event?: EventItem };

/** /events/[id] page */
export async function getPublicEventAction(id: string): Promise<PublicEventResult> {
  try {
    const res = await getPublicEventRequest(id);
    return { success: true, event: toEvent(res.data.data) };
  } catch (err) {
    return {
      success: false,
      notFound: axios.isAxiosError(err) && err.response?.status === 404,
      message: getErrorMessage(err),
    };
  }
}

/**
 * Trending events: Hero আর Home slider দুই জায়গায় একই data। Home page একবার ডেকে দুই component কে পাঠায়।
 * Backend এ এখন আলাদা trending endpoint নেই, তাই /events/upcoming (সবচেয়ে কাছের approved event) ব্যবহার হচ্ছে।
 */
export async function getTrendingEventsAction(limit = 8): Promise<{ success: boolean; message?: string; events: EventItem[] }> {
  try {
    const res = await listUpcomingEventsRequest(limit);
    const docs = (res.data?.data?.docs ?? []) as Record<string, unknown>[];
    return { success: true, events: docs.map(toEvent) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), events: [] };
  }
}
