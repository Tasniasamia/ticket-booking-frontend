"use server";
import { z } from "zod";
import { getToken } from "@/lib/session";
import { getErrorMessage } from "@/features/auth/service";
import { toApiParams, type PaginationMeta, type TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { toSubscriber, type Subscriber } from "./types";
import { createSubscribeRequest, listAdminSubscribersRequest } from "./service";

const subscribeSchema = z.object({ email: z.string().email("Valid email required") });

export type SubscriberTableResult = {
  success: boolean; message?: string; subscribers?: Subscriber[]; meta?: PaginationMeta;
};

export async function subscribeAction(input: { email: string }): Promise<ActionResult> {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please enter a valid email." };
  try {
    const res = await createSubscribeRequest(parsed.data);
    return { success: true, message: res.data.message ?? "Subscribed successfully." };
  } catch (err) { return { success: false, message: getErrorMessage(err) }; }
}

export async function getSubscriberTableAction(params: TableParams): Promise<SubscriberTableResult> {
  if (!(await getToken())) return { success: false, message: "Please log in.", subscribers: [] };
  try {
    const res = await listAdminSubscribersRequest(toApiParams(params));
    const data = res.data.data;
    return { success: true, subscribers: (data.docs ?? []).map((d) => toSubscriber(d as Record<string, unknown>)), meta: data as PaginationMeta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), subscribers: [] };
  }
}
