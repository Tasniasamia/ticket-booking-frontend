import { api } from "@/lib/api-client";
import type { PaginationMeta } from "@/components/common/table/table-params";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
export type ApiPaginated<T> = { docs: T[] } & PaginationMeta;
type Params = Record<string, string | number>;

// lang শুধু search এর জন্য (title ->> 'en')। Response এ সবসময় সব language আসে।

/** Admin: সব event, ?status=pending&search=... সহ */
export const listAdminEventsRequest = (params: Params, lang: string) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/events/admin", { params: { ...params, lang } });

/** Manager: শুধু নিজের event */
export const listMyEventsRequest = (params: Params, lang: string) =>
  api.get<ApiSuccess<ApiPaginated<Record<string, unknown>>>>("/events/myEvents", { params: { ...params, lang } });

export type EventPayload = {
  title: Record<string, string>;
  description: Record<string, string>;
  location: Record<string, string>;
  starts_at: string; // ISO
  total_tickets: number;
  price: number;
  currency: string;
  category_id: number;
  thumbnail_image: { id: number; url: string };
  images: { id: number; url: string }[];
};

export const createEventRequest = (data: EventPayload) => api.post<ApiSuccess<unknown>>("/events", data);

// Update এ total_tickets যায় না (backend UpdateRequest এ নেই)
export type EventUpdatePayload = Omit<EventPayload, "total_tickets">;

export const updateEventRequest = (id: number, data: EventUpdatePayload) =>
  api.put<ApiSuccess<unknown>>(`/events/${id}`, data);

export const deleteEventRequest = (id: string | number) => api.delete<ApiSuccess<unknown>>(`/events/${id}`);

export const updateEventStatusRequest = (eventId: number, status: string) =>
  api.patch<ApiSuccess<unknown>>("/events/updateStatus", { eventId, status });
