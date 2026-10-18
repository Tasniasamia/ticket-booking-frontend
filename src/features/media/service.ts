import { api } from "@/lib/api-client";
import type { MediaResponse, UploadMediaParams } from "./types";

type ApiSuccess<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export async function uploadMediaRequest(params: UploadMediaParams) {
  const form = new FormData();
  form.append("file", params.file);
  form.append("model_name", params.model_name);
  if (params.model_id != null) {
    form.append("model_id", String(params.model_id));
  }
  if (params.folder) {
    form.append("folder", params.folder);
  }

  return api.post<ApiSuccess<{ media: MediaResponse }>>("/media/upload", form, {
    timeout: 60_000,
  });
}

export async function deleteMediaRequest(id: number) {
  return api.delete<ApiSuccess<null>>(`/media/${id}`);
}

export async function getMediaByIdRequest(id: number) {
  return api.get<ApiSuccess<{ media: MediaResponse }>>(`/media/${id}`);
}