"use server";

import { z } from "zod";
import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import {
  toEventCategory,
  toEventCategoryListItem,
  type EventCategory,
  type EventCategoryListItem,
} from "./types";
import {
  createEventCategoryRequest,
  deleteEventCategoryRequest,
  getEventCategoriesRequest,
  getEventCategoryByIdRequest,
  listEventCategoriesRequest,
  updateEventCategoryRequest,
} from "./service";
import { eventCategorySchema, type EventCategoryFormValues } from "./schemas";

// ফাঁকা language বাদ দিই, backend এ শুধু যেগুলো লেখা হয়েছে সেগুলো যাবে।
const clean = (r: Record<string, string>) =>
  Object.fromEntries(Object.entries(r).filter(([, v]) => v.trim() !== ""));

/* ---------- Public list (website) ---------- */

export type EventCategoryResult = {
  success: boolean;
  message?: string;
  eventCategories?: EventCategoryListItem[];
};

export async function getEventCategoriesAction(lang: string): Promise<EventCategoryResult> {
  try {
    const res = await getEventCategoriesRequest(lang);
    const eventCategories = res.data.data.docs.map(toEventCategoryListItem);
    return { success: true, eventCategories };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/* ---------- Admin table ---------- */

export type EventCategoryTableResult = {
  success: boolean;
  message?: string;
  eventCategories?: EventCategoryListItem[];
  meta?: PaginationMeta;
};

/** Admin table: pagination/search/sort সহ, এক language এর string নিয়ে। */
export async function getEventCategoryTableAction(
  params: TableParams,
  lang: string,
): Promise<EventCategoryTableResult> {
  try {
    const res = await listEventCategoriesRequest(toApiParams(params), lang);
    const { docs, ...meta } = res.data.data;
    return { success: true, eventCategories: docs.map(toEventCategoryListItem), meta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/* ---------- Edit: সব language সহ একটা category ---------- */

export type EventCategoryDetailResult = {
  success: boolean;
  message?: string;
  eventCategory?: EventCategory;
};

export async function getEventCategoryByIdAction(
  id: string | number,
): Promise<EventCategoryDetailResult> {
  try {
    const res = await getEventCategoryByIdRequest(id);
    return { success: true, eventCategory: toEventCategory(res.data.data) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/* ---------- Delete ---------- */

/** Table এর delete button এ বসে। DataTable এই ActionResult নিয়েই toast দেখায়। */
export async function deleteEventCategoryAction(id: string | number): Promise<ActionResult> {
  try {
    await deleteEventCategoryRequest(id);
    return { success: true, message: "Event category deleted." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/* ---------- Create / Update ---------- */

export type EventCategoryFormResult = ActionResult & {
  fieldErrors?: Record<string, string[] | undefined>;
};

const invalid = (error: z.ZodError): EventCategoryFormResult => ({
  success: false,
  message: "Please check the form.",
  fieldErrors: z.flattenError(error).fieldErrors,
});

export async function createEventCategoryAction(
  input: EventCategoryFormValues,
): Promise<EventCategoryFormResult> {
  const parsed = eventCategorySchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { name, description, event_category_image_url, event_category_image_id } = parsed.data;
  try {
    await createEventCategoryRequest({
      name: clean(name),
      description: clean(description),
      event_category_image_url,
      event_category_image_id,
    });
    return { success: true, message: "Event category created." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function updateEventCategoryAction(
  id: string | number,
  input: EventCategoryFormValues,
): Promise<EventCategoryFormResult> {
  const parsed = eventCategorySchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const { name, description, event_category_image_url, event_category_image_id } = parsed.data;
  try {
    await updateEventCategoryRequest(id, {
      name: clean(name),
      description: clean(description),
      event_category_image_url,
      event_category_image_id,
    });
    return { success: true, message: "Event category updated." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}