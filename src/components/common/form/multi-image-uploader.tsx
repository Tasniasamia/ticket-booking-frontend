"use client";
import { useRef, useState, type ReactNode } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { deleteMediaAction, uploadMediaAction } from "@/features/media/actions";
import type { MediaModelName } from "@/features/media/types";
import { ImagePreviewButton } from "./image-preview-modal";

/** Backend এ যে shape এ পাঠাবে */
export type GalleryImage = { id: number; url: string };

/** upload চলাকালীন local preview (blob URL) */
type PendingImage = { key: string; url: string };

export type MultiImageUploaderProps = {
  /** বর্তমান ছবির list (controlled) */
  value: GalleryImage[];  //array of image object
  onChange: (value: GalleryImage[]) => void;  //array of image object void

  /* ---------- default upload/delete এর জন্য ---------- */
  modelName?: MediaModelName; //props for backend
  modelId?: number;//props for backend
  folder?: string;//props for backend
  upload?: (file: File) => Promise<GalleryImage>; // real work file niye array object return korbe
  /** server থেকে মোছার কাজ। true ফেরত দিলে list থেকে বাদ যাবে */
  remove?: (image: GalleryImage) => Promise<boolean>;  //image object nibe cloudinary theke remove hoice kina ta return korbe.
  /** false দিলে X চাপলে server থেকে মুছবে না, শুধু list থেকে বাদ যাবে */
  deleteOnRemove?: boolean; //no idea
  maxFiles?: number; 
  maxSizeMB?: number;
  accept?: string;    //no idea
  disabled?: boolean;  //muliimage component k disable korbe

  /* ---------- চেহারা ---------- */
  columns?: 2 | 3 | 4 | 5 | 6;   
  aspect?: string; // যেমন "1/1", "16/9"  // width:height
  rounded?: "md" | "lg" | "xl" | "2xl";  
  addLabel?: string;   // label name
  emptyIcon?: ReactNode;  //icon ashbe
  hideCounter?: boolean;   
  className?: string;
  onUploaded?: (images: GalleryImage[]) => void;
  onRemoved?: (image: GalleryImage) => void;

  error?: string;
};


const colsMap = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
  6: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6",
} as const;

const roundedMap = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
} as const;

export function MultiImageUploader({
  value,
  onChange,
  modelName,
  modelId,
  folder,
  upload,
  remove,
  deleteOnRemove = true,
  maxFiles = 10,
  maxSizeMB = 5,
  disabled = false,
  columns = 4,
  aspect = "1/1",
  rounded = "xl",
  addLabel = "Add images",
  emptyIcon,
  hideCounter = false,
  className,
  onUploaded,
  onRemoved,
  error,
}: MultiImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<PendingImage[]>([]);
  const uploadingCount = uploading.length;
  const [removingId, setRemovingId] = useState<number | null>(null);

  const busy = uploadingCount > 0 || removingId !== null;
  const roundedCls = roundedMap[rounded];

  /* ---------- default upload (project এর media action) ---------- */
  const defaultUpload = async (file: File): Promise<GalleryImage> => {
    if (!modelName) throw new Error("modelName or custom upload is required");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("model_name", modelName);
    if (modelId != null) fd.append("model_id", String(modelId));
    if (folder) fd.append("folder", folder);

    const res = await uploadMediaAction(fd);
    if (!res.success || !res.media) throw new Error(res.message || "Upload failed");
    return { id: res.media.id, url: res.media.public_url };
  };

  /* ---------- default delete ---------- */
  const defaultRemove = async (img: GalleryImage): Promise<boolean> => {
    const res = await deleteMediaAction(img.id);
    if (!res.success) toast.error(res.message || "Failed to remove image.");
    return res.success;
  };

  const uploadOne = async (file: File): Promise<GalleryImage | null> => {
    try {
      return await (upload ?? defaultUpload)(file);
    } catch (e) {
      toast.error(`${file.name}: ${e instanceof Error ? e.message : "Upload failed"}`);
      return null;
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const slotsLeft = maxFiles - value.length;
    if (slotsLeft <= 0) {
      toast.error(`You can upload at most ${maxFiles} images.`);
      return;
    }

    let files = Array.from(fileList);
    if (files.length > slotsLeft) {
      toast.info(`Only ${slotsLeft} more image(s) allowed, extra files skipped.`);
      files = files.slice(0, slotsLeft);
    }

    const valid = files.filter((f) => {
      if (!f.type.startsWith("image/")) {
        toast.error(`${f.name}: only image files are allowed`);
        return false;
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${f.name}: must be smaller than ${maxSizeMB} MB`);
        return false;
      }
      return true;
    });
    if (valid.length === 0) return;

    // file select করার সাথে সাথেই local preview বানাও
    const pending: PendingImage[] = valid.map((f, i) => ({
      key: `${Date.now()}-${i}`,
      url: URL.createObjectURL(f),
    }));
    setUploading(pending);
    try {
      const results = await Promise.all(valid.map(uploadOne));
      const uploaded = results.filter((r): r is GalleryImage => r !== null);
      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
        onUploaded?.(uploaded);
      }
    } finally {
      pending.forEach((p) => URL.revokeObjectURL(p.url));
      setUploading([]);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeOne = async (img: GalleryImage) => {
    setRemovingId(img.id);
    try {
      if (deleteOnRemove) {
        const ok = await (remove ?? defaultRemove)(img);
        if (!ok) return;
      }
      onChange(value.filter((v) => v.id !== img.id));
      onRemoved?.(img);
    } catch {
      toast.error("Failed to remove image.");
    } finally {
      setRemovingId(null);
    }
  };

  const canAdd = !disabled && !busy && value.length < maxFiles;
  const tileCls = cn("relative overflow-hidden border border-border bg-muted/30", roundedCls);

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        multiple={maxFiles > 1}
        className="sr-only"
        disabled={!canAdd}
        onChange={(e) => {
          if (e.target.files?.length) void handleFiles(e.target.files);
        }}
      />

      <div className={cn("grid gap-3", colsMap[columns])}>
        {value.map((img) => (
          <div key={img.id} className={tileCls} style={{ aspectRatio: aspect }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-full w-full object-cover" />

            {removingId === img.id ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="absolute right-1.5 top-1.5 flex gap-1">
                <ImagePreviewButton
                  src={img.url}
                  alt="Image preview"
                  title="View image"
                  className="cursor-pointer inline-flex size-7 items-center justify-center rounded-lg border border-border bg-background/90 text-foreground shadow-sm hover:bg-muted"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => void removeOne(img)}
                    disabled={busy}
                    title="Remove image"
                    className="cursor-pointer inline-flex size-7 items-center justify-center rounded-lg border border-border bg-background/90 text-destructive shadow-sm hover:bg-destructive/10 disabled:opacity-50"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {uploading.map((p) => (
          <div key={p.key} className={tileCls} style={{ aspectRatio: aspect }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          </div>
        ))}

        {value.length + uploadingCount < maxFiles && (
          <button
            type="button"
            disabled={!canAdd}
            onClick={() => inputRef.current?.click()}
            style={{ aspectRatio: aspect }}
            className={cn(
              "flex flex-col cursor-pointer  items-center justify-center gap-1 border-2 border-dashed border-border bg-muted/20 text-center text-xs text-muted-foreground transition-colors",
              "hover:border-primary/50 hover:bg-muted/40 disabled:pointer-events-none disabled:opacity-50",
              roundedCls,
              error && "border-destructive",
            )}
          >
            {emptyIcon ?? <ImagePlus className="size-6 text-primary" />}
            {addLabel}
          </button>
        )}
      </div>

      {!hideCounter && (
        <p className="mt-2 text-xs text-muted-foreground">
          {value.length}/{maxFiles} images · max {maxSizeMB} MB each
        </p>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}