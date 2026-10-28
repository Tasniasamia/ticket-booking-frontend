/** Backend media DTO response (POST /api/v1/media/upload → data.media) */
export type MediaResponse = {
  id: number;
  image_id: string;
  public_url: string;
  secure_url: string;
  resource_type: string;
  format: string;
  type: string;
  model_name: string;
  model_id?: number | null;
  folder?: string;
  size: number;
  width?: number;
  height?: number;
  original_name?: string;
  created_at: string;
};

export type MediaModelName =
  | "event"
  | "user"
  | "product"
  | "booking"
  | "category"
  | "banner"
  | "payments"
  | "event_categories"
  |"blog";

export type UploadMediaParams = {
  file: File;
  model_name: MediaModelName;
  model_id?: number;
  folder?: string;
};