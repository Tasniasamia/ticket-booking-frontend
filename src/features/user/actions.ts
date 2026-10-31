"use server";

import { z } from "zod";
import { getToken } from "@/lib/session";
import { getErrorMessage } from "@/features/auth/service";
import { toProfile, type Profile } from "./type";
import { profileSchema, type ProfileInput } from "./schemas";
import { getMeRequest, updateMeRequest } from "./service";

export type ProfileResult = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  user?: Profile;
};

const UNAUTHORIZED: ProfileResult = {
  success: false,
  message: "Please log in to continue.",
};

/** Login এর পর (আর page খুললে) provider এটা ডাকে। cookie র token দিয়ে GET /auth/me। */
export async function getMeAction(): Promise<ProfileResult> {
  if (!(await getToken())) return UNAUTHORIZED;
  try {
    const res = await getMeRequest();
    return { success: true, user: toProfile(res.data.data) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

/** PATCH /auth/me। form শুধু বদলানো field পাঠায়, তাই partial() দিয়ে যাচাই। */
export async function updateProfileAction(
  input: Partial<ProfileInput>,
): Promise<ProfileResult> {
  const parsed = profileSchema.partial().safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  if (!(await getToken())) return UNAUTHORIZED;

  const body = { ...parsed.data };
  if (body.profile_image === null) body.profile_image = "";
  if (body.profile_image_id === null) body.profile_image_id = 0;

  try {
    console.log("parsed data of update actions ", parsed.data);
    const res = await updateMeRequest(body);
    return {
      success: true,
      message: res.data.message ?? "Profile updated.",
      user: toProfile(res.data.data),
    };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}


import type { PaginationMeta, TableParams } from "@/components/common/table/table-params";
import type { ActionResult } from "@/components/common/table/data-table";
import { toApiParams } from "@/components/common/table/table-params";
import {
  deleteUserRequest, getPublicManagerRequest, listManagersAdminRequest,
  listPublicManagersRequest, listUsersRequest, updateMemberRequest,
} from "./service";

export type UsersTableResult = {
  success: boolean;
  message?: string;
  users?: Profile[];
  meta?: PaginationMeta;
};

export async function getUsersTableAction(params: TableParams): Promise<UsersTableResult> {
  if (!(await getToken())) return { success: false, message: "Please log in.", users: [] };
  try {
    const res = await listUsersRequest(toApiParams(params));
    const data = res.data.data;
    return { success: true, users: (data.docs ?? []).map((d) => toProfile(d as Record<string, unknown>)), meta: data as PaginationMeta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), users: [] };
  }
}

export async function getManagersTableAction(params: TableParams): Promise<UsersTableResult> {
  if (!(await getToken())) return { success: false, message: "Please log in.", users: [] };
  try {
    const res = await listManagersAdminRequest(toApiParams(params));
    const data = res.data.data;
    return { success: true, users: (data.docs ?? []).map((d) => toProfile(d as Record<string, unknown>)), meta: data as PaginationMeta };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), users: [] };
  }
}

// export async function getPublicManagersAction(limit = 50) {
//   try {
//     const res = await listPublicManagersRequest({ page: 1, limit });
//     const data = res.data.data;
//     return {
//       success: true as const,
//       managers: (data.docs ?? []).map((d) => toProfile(d as Record<string, unknown>)),
//       meta: data as PaginationMeta,
//     };
//   } catch (err) {
//     return { success: false as const, message: getErrorMessage(err), managers: [] as Profile[] };
//   }
// }

export type ManagerTableResult = {
  success: boolean; message?: string; managers?: Profile[]; meta?: PaginationMeta;
};
export async function getPublicManagersAction(
  limitOrParams: number | TableParams = 20,
): Promise<ManagerTableResult> {
  try {
    const params =
      typeof limitOrParams === "number"
        ? { page: 1, limit: limitOrParams }
        : toApiParams(limitOrParams);
    const res = await listPublicManagersRequest(params);
    const data = res.data.data;
    return {
      success: true,
      managers: (data.docs ?? []).map((d) => toProfile(d as Record<string, unknown>)),
      meta: data as PaginationMeta,
    };
  } catch (err) {
    return { success: false, message: getErrorMessage(err), managers: [] };
  }
}









export async function getPublicManagerAction(id: string | number) {
  try {
    const res = await getPublicManagerRequest(id);
    return { success: true as const, manager: toProfile(res.data.data) };
  } catch (err) {
    return { success: false as const, message: getErrorMessage(err) };
  }
}

export async function updateMemberAction(id: number, input: Record<string, unknown>): Promise<ActionResult & { user?: Profile }> {
  if (!(await getToken())) return { success: false, message: "Please log in." };
  try {
    const res = await updateMemberRequest(id, input);
    return { success: true, message: res.data.message ?? "User updated.", user: toProfile(res.data.data as Record<string, unknown>) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function deleteUserAction(id: number | string): Promise<ActionResult> {
  if (!(await getToken())) return { success: false, message: "Please log in." };
  try {
    const res = await deleteUserRequest(id);
    return { success: true, message: res.data.message ?? "User deleted." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
