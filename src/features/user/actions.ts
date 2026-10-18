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
