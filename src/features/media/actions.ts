"use server";
import { getToken } from "@/lib/session";
import { uploadMediaRequest, deleteMediaRequest } from "./service";
import type { MediaModelName, MediaResponse } from "./types";

export type MediaActionResult = {
  success: boolean;
  message?: string;
  media?: MediaResponse;
};

const UNAUTHORIZED: MediaActionResult = {
  success: false,
  message: "Please log in to continue.",
};

export async function uploadMediaAction(
  formData: FormData,
): Promise<MediaActionResult> {
  if (!(await getToken())) return UNAUTHORIZED;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "file is required" };
  }

  const modelName = formData.get("model_name");
  if (typeof modelName !== "string" || !modelName) {
    return { success: false, message: "model_name is required" };
  }

  const modelIdRaw = formData.get("model_id");
  const folderRaw = formData.get("folder");

  const model_id =
    typeof modelIdRaw === "string" && modelIdRaw !== ""
      ? Number(modelIdRaw)
      : undefined;
  const folder =
    typeof folderRaw === "string" && folderRaw !== "" ? folderRaw : undefined;

  try {
    const res = await uploadMediaRequest({
      file,
      model_name: modelName as MediaModelName,
      model_id: Number.isFinite(model_id) ? model_id : undefined,
      folder,
    });
    const media = res.data?.data?.media;

    if (!media) {
      return { success: false, message: res.data?.message || "Upload failed" };
    }
    return { success: true, media, message: res.data.message };
  } catch (err: unknown) {
    const ax = err as {
      response?: { data?: { errorMessage?: string; message?: string } };
      message?: string;
    };
    return {
      success: false,
      message:
        ax?.response?.data?.errorMessage ||
        ax?.response?.data?.message ||
        ax?.message ||
        "Failed to upload file",
    };
  }
}

export async function deleteMediaAction(id: number): Promise<MediaActionResult> {
  if (!(await getToken())) return UNAUTHORIZED;
  try {
    await deleteMediaRequest(id);
    return { success: true, message: "Deleted" };
  } catch (err: unknown) {
    const ax = err as {
      response?: { data?: { errorMessage?: string; message?: string } };
      message?: string;
    };
    return {
      success: false,
      message:
        ax?.response?.data?.errorMessage ||
        ax?.response?.data?.message ||
        ax?.message ||
        "Failed to delete",
    };
  }
}