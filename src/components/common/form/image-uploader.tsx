// "use client";

// import {
//   useCallback,
//   useEffect,
//   useId,
//   useRef,
//   useState,
//   type ReactNode,
// } from "react";
// import { ImagePlus, Loader2, X, Replace } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { deleteMediaAction, uploadMediaAction } from "@/features/media/actions";
// import type { MediaModelName, MediaResponse } from "@/features/media/types";
// import { toast } from "react-toastify";

// const DEFAULT_MAX_MB = 5;

// export type ImageUploaderValue = MediaResponse | null;

// export type ImageUploaderProps = {
//   value?: ImageUploaderValue;
//   onChange?: (value: ImageUploaderValue) => void;
//   onBlur?: () => void;
//   modelName?: MediaModelName;
//   modelId?: number;
//   folder?: string;
//   upload?: (file: File) => Promise<MediaResponse>;
//   defaultPreviewUrl?: string | null;
//   accept?: string;
//   maxSizeMB?: number;
//   disabled?: boolean;
//   aspect?: string;
//   size?: "sm" | "md" | "lg" | "full";
//   rounded?: "md" | "lg" | "xl" | "2xl" | "full";
//   showActions?: boolean;
//   enableDrop?: boolean;
//   id?: string;
//   name?: string;
//   className?: string;
//   boxClassName?: string;
//   error?: string;
//   emptyContent?: ReactNode;
//   loadingContent?: ReactNode;
//   onUploadStart?: (file: File) => void;
//   onUploadSuccess?: (media: MediaResponse) => void;
//   onUploadError?: (message: string) => void;
//   onRemove?: () => void;          // delete সফল হলে ডাকা হয়
//   validate?: (file: File) => string | null;
//   mediaId?: number | null;        // কোন media delete হবে
// };

// const sizeMap = {
//   sm: "max-w-[160px]",
//   md: "max-w-[240px]",
//   lg: "max-w-[360px]",
//   full: "w-full",
// } as const;

// const roundedMap = {
//   md: "rounded-md",
//   lg: "rounded-lg",
//   xl: "rounded-xl",
//   "2xl": "rounded-2xl",
//   full: "rounded-full",
// } as const;

// /** Server action দিয়ে upload — client থেকে next/headers import হয় না */
// async function defaultUpload(
//   file: File,
//   ctx: { modelName: MediaModelName; modelId?: number; folder?: string },
// ): Promise<MediaResponse> {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("model_name", ctx.modelName);
//   if (ctx.modelId != null) formData.append("model_id", String(ctx.modelId));
//   if (ctx.folder) formData.append("folder", ctx.folder);

//   const res = await uploadMediaAction(formData);

//   if (!res.success || !res.media) {
//     toast.error(res.message || "Upload failed");
//     throw new Error(res.message || "Upload failed");
//   }
//   toast.success(res.message || "Upload successful");
//   return res.media;
// }

// function extractErrorMessage(err: unknown): string {
//   const ax = err as {
//     response?: { data?: { errorMessage?: string; message?: string } };
//     message?: string;
//   };
//   return (
//     ax?.response?.data?.errorMessage ||
//     ax?.response?.data?.message ||
//     ax?.message ||
//     "Failed to upload image"
//   );
// }

// export function ImageUploader({
//   onChange,
//   onBlur,
//   modelName,
//   modelId,
//   folder,
//   upload,
//   defaultPreviewUrl = null,
//   maxSizeMB = DEFAULT_MAX_MB,
//   disabled = false,
//   aspect = "16/9",
//   size = "full",
//   rounded = "xl",
//   showActions = true,
//   enableDrop = true,
//   id: idProp,
//   name,
//   className,
//   boxClassName,
//   error: externalError,
//   emptyContent,
//   loadingContent,
//   onUploadStart,
//   onUploadSuccess,
//   onUploadError,
//   onRemove,
//   validate,
//   mediaId,
// }: ImageUploaderProps) {
//   const autoId = useId();
//   const inputId = idProp ?? autoId;
//   const inputRef = useRef<HTMLInputElement>(null);

//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [localError, setLocalError] = useState<string | null>(null);
//   const [dragOver, setDragOver] = useState(false);

//   // ছবি দেখানো হয় parent এর দেওয়া URL থেকে
//   const displayUrl = defaultPreviewUrl || null;
//   const showError = localError || externalError || null;

//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   const clearPreview = useCallback(() => {
//     setPreviewUrl((prev) => {
//       if (prev) URL.revokeObjectURL(prev);
//       return null;
//     });
//   }, []);

//   const defaultValidate = useCallback(
//     (file: File): string | null => {
//       if (!file.type.startsWith("image/"))
//         return "Only image files are allowed";
//       if (file.size > maxSizeMB * 1024 * 1024) {
//         return `Image must be smaller than ${maxSizeMB} MB`;
//       }
//       return null;
//     },
//     [maxSizeMB],
//   );

//   // ---------- UPLOAD ----------
//   const handleFile = async (file: File) => {
//     setLocalError(null);
//     const validationError = (validate ?? defaultValidate)(file);
//     if (validationError) {
//       setLocalError(validationError);
//       onUploadError?.(validationError);
//       return;
//     }
//     if (!upload && !modelName) {
//       const msg = "modelName or custom upload function is required";
//       setLocalError(msg);
//       onUploadError?.(msg);
//       return;
//     }

//     clearPreview();
//     setPreviewUrl(URL.createObjectURL(file));
//     setUploading(true);
//     onUploadStart?.(file);

//     try {
//       const media = upload
//         ? await upload(file)
//         : await defaultUpload(file, { modelName: modelName!, modelId, folder });
//       onChange?.(media);
//       onUploadSuccess?.(media);   // এখানে onRemove আর ডাকা হয় না
//       clearPreview();
//     } catch (err) {
//       clearPreview();
//       const msg = extractErrorMessage(err);
//       setLocalError(msg);
//       onUploadError?.(msg);
//     } finally {
//       setUploading(false);
//       if (inputRef.current) inputRef.current.value = "";
//     }
//   };

//   // ---------- DELETE ----------
//   const remove = async () => {
//     if (!mediaId) {
//       toast.error("Cannot remove image: media ID is missing.");
//       return;
//     }

//     try {
//       const res = await deleteMediaAction(mediaId);

//       if (!res?.success) {
//         toast.error(res?.message || "Failed to remove image.");
//         return;
//       }

//       toast.success(res.message || "Image removed successfully.");
//       clearPreview();
//       setLocalError(null);
//       onChange?.(null);
//       onRemove?.();
//       onBlur?.();
//       if (inputRef.current) inputRef.current.value = "";
//     } catch {
//       toast.error("Failed to remove image. Please try again.");
//     }
//   };

//   const openPicker = () => {
//     if (!disabled && !uploading) inputRef.current?.click();
//   };

//   const roundedCls = roundedMap[rounded];
//   const sizeCls = sizeMap[size];

//   return (
//     <div className={cn(sizeCls, className)}>
//       <input
//         ref={inputRef}
//         id={inputId}
//         name={name}
//         type="file"
//         className="sr-only"
//         disabled={disabled || uploading}
//         onChange={(e) => {
//           const file = e.target.files?.[0];
//           if (file) void handleFile(file);
//         }}
//         onBlur={onBlur}
//         aria-invalid={!!showError}
//       />

//       {displayUrl ? (
//         <div
//           className={cn(
//             "relative overflow-hidden border border-border bg-muted/30",
//             roundedCls,
//             boxClassName,
//           )}
//           style={{ aspectRatio: aspect }}
//         >
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={displayUrl}
//             alt="Preview"
//             className={cn(
//               "h-full w-full object-cover",
//               rounded === "full" && "rounded-full",
//             )}
//           />
//           {uploading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
//               {loadingContent ?? (
//                 <Loader2 className="size-8 animate-spin text-primary" />
//               )}
//             </div>
//           )}
//           {showActions && !uploading && !disabled && (
//             <div className="absolute right-2 top-2 flex gap-1.5">
//               <button
//                 type="button"
//                 onClick={openPicker}
//                 title="Replace image"
//                 className="cursor-pointer inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background/90 text-foreground shadow-sm backdrop-blur hover:bg-muted"
//               >
//                 <Replace className="size-3.5" />
//               </button>
//               <button
//                 type="button"
//                 onClick={() => void remove()}
//                 title="Remove image"
//                 className="cursor-pointer inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background/90 text-destructive shadow-sm backdrop-blur hover:bg-destructive/10"
//               >
//                 <X className="size-3.5" />
//               </button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <button
//           type="button"
//           disabled={disabled || uploading}
//           onClick={openPicker}
//           onDragOver={(e) => {
//             if (!enableDrop) return;
//             e.preventDefault();
//             if (!disabled && !uploading) setDragOver(true);
//           }}
//           onDragLeave={() => setDragOver(false)}
//           onDrop={(e) => {
//             e.preventDefault();
//             setDragOver(false);
//             if (!enableDrop || disabled || uploading) return;
//             const file = e.dataTransfer.files?.[0];
//             if (file) void handleFile(file);
//           }}
//           className={cn(
//             "flex w-full flex-col cursor-pointer  items-center justify-center gap-3 border-2 border-dashed px-4 text-center transition-colors outline-none",
//             roundedCls,
//             "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
//             "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
//             "disabled:pointer-events-none disabled:opacity-50",
//             dragOver && "border-primary bg-primary/5",
//             showError && "border-destructive",
//             boxClassName,
//           )}
//           style={{ aspectRatio: aspect }}
//         >
//           {uploading
//             ? (loadingContent ?? (
//                 <>
//                   <Loader2 className="size-10 animate-spin text-primary" />
//                   <p className="text-sm font-medium text-muted-foreground">
//                     Uploading…
//                   </p>
//                 </>
//               ))
//             : (emptyContent ?? (
//                 <>
//                   <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
//                     <ImagePlus className="size-6" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold">
//                       {enableDrop
//                         ? "Click to upload or drag & drop"
//                         : "Click to upload"}
//                     </p>
//                     <p className="mt-1 text-xs text-muted-foreground">
//                       PNG, JPG, WEBP or GIF (max {maxSizeMB} MB)
//                     </p>
//                   </div>
//                 </>
//               ))}
//         </button>
//       )}

//       {showError && (
//         <p role="alert" className="mt-1.5 text-sm text-red-500">
//           {showError}
//         </p>
//       )}
//     </div>
//   );
// }




"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ImagePlus, Loader2, X, Replace } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteMediaAction, uploadMediaAction } from "@/features/media/actions";
import type { MediaModelName, MediaResponse } from "@/features/media/types";
import { toast } from "react-toastify";
import { ImagePreviewButton } from "./image-preview-modal";

const DEFAULT_MAX_MB = 5;

export type ImageUploaderValue = MediaResponse | null;

export type ImageUploaderProps = {
  value?: ImageUploaderValue;
  onChange?: (value: ImageUploaderValue) => void;
  onBlur?: () => void;
  modelName?: MediaModelName;
  modelId?: number;
  folder?: string;
  upload?: (file: File) => Promise<MediaResponse>;
  defaultPreviewUrl?: string | null;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  aspect?: string;
  size?: "sm" | "md" | "lg" | "full";
  rounded?: "md" | "lg" | "xl" | "2xl" | "full";
  showActions?: boolean;
  enableDrop?: boolean;
  id?: string;
  name?: string;
  className?: string;
  boxClassName?: string;
  error?: string;
  emptyContent?: ReactNode;
  loadingContent?: ReactNode;
  onUploadStart?: (file: File) => void;
  onUploadSuccess?: (media: MediaResponse) => void;
  onUploadError?: (message: string) => void;
  onRemove?: () => void;          // delete সফল হলে ডাকা হয়
  validate?: (file: File) => string | null;
  mediaId?: number | null;        // কোন media delete হবে
};

const sizeMap = {
  sm: "max-w-[160px]",
  md: "max-w-[240px]",
  lg: "max-w-[360px]",
  full: "w-full",
} as const;

const roundedMap = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
} as const;

/** Server action দিয়ে upload — client থেকে next/headers import হয় না */
async function defaultUpload(
  file: File,
  ctx: { modelName: MediaModelName; modelId?: number; folder?: string },
): Promise<MediaResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("model_name", ctx.modelName);
  if (ctx.modelId != null) formData.append("model_id", String(ctx.modelId));
  if (ctx.folder) formData.append("folder", ctx.folder);

  const res = await uploadMediaAction(formData);

  if (!res.success || !res.media) {
    toast.error(res.message || "Upload failed");
    throw new Error(res.message || "Upload failed");
  }
  toast.success(res.message || "Upload successful");
  return res.media;
}

function extractErrorMessage(err: unknown): string {
  const ax = err as {
    response?: { data?: { errorMessage?: string; message?: string } };
    message?: string;
  };
  return (
    ax?.response?.data?.errorMessage ||
    ax?.response?.data?.message ||
    ax?.message ||
    "Failed to upload image"
  );
}

export function ImageUploader({
  onChange,
  onBlur,
  modelName,
  modelId,
  folder,
  upload,
  defaultPreviewUrl = null,
  maxSizeMB = DEFAULT_MAX_MB,
  disabled = false,
  aspect = "16/9",
  size = "full",
  rounded = "xl",
  showActions = true,
  enableDrop = true,
  id: idProp,
  name,
  className,
  boxClassName,
  error: externalError,
  emptyContent,
  loadingContent,
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  onRemove,
  validate,
  mediaId,
}: ImageUploaderProps) {
  const autoId = useId();
  const inputId = idProp ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // ফাইল select করলেই local preview (blob) দেখায়, না থাকলে parent এর URL
  const displayUrl = previewUrl || defaultPreviewUrl || null;
  const showError = localError || externalError || null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearPreview = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  // parent নতুন URL দিলে, সেই ছবি load হওয়ার পর local preview সরাও (flash এড়াতে)
  const lastUrlRef = useRef(defaultPreviewUrl);
  useEffect(() => {
    if (lastUrlRef.current === defaultPreviewUrl) return;
    lastUrlRef.current = defaultPreviewUrl;

    // URL null হওয়া মানে remove(), সেখানেই clearPreview() ডাকা হয়
    if (!defaultPreviewUrl) return;

    let cancelled = false;
    const img = new window.Image();
    const done = () => {
      if (!cancelled) clearPreview();
    };
    img.onload = done;
    img.onerror = done;
    img.src = defaultPreviewUrl;
    return () => {
      cancelled = true;
    };
  }, [defaultPreviewUrl, clearPreview]);

  const defaultValidate = useCallback(
    (file: File): string | null => {
      if (!file.type.startsWith("image/"))
        return "Only image files are allowed";
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `Image must be smaller than ${maxSizeMB} MB`;
      }
      return null;
    },
    [maxSizeMB],
  );

  // ---------- UPLOAD ----------
  const handleFile = async (file: File) => {
    setLocalError(null);
    const validationError = (validate ?? defaultValidate)(file);
    if (validationError) {
      setLocalError(validationError);
      onUploadError?.(validationError);
      return;
    }
    if (!upload && !modelName) {
      const msg = "modelName or custom upload function is required";
      setLocalError(msg);
      onUploadError?.(msg);
      return;
    }

    clearPreview();
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    onUploadStart?.(file);

    try {
      const media = upload
        ? await upload(file)
        : await defaultUpload(file, { modelName: modelName!, modelId, folder });
      onChange?.(media);
      onUploadSuccess?.(media);   // এখানে onRemove আর ডাকা হয় না
      // local preview এখানে সরানো হয় না, নিচের effect নতুন URL load হলে সরাবে
    } catch (err) {
      clearPreview();
      const msg = extractErrorMessage(err);
      setLocalError(msg);
      onUploadError?.(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // ---------- DELETE ----------
  const remove = async () => {
    if (!mediaId) {
      toast.error("Cannot remove image: media ID is missing.");
      return;
    }

    try {
      const res = await deleteMediaAction(mediaId);

      if (!res?.success) {
        toast.error(res?.message || "Failed to remove image.");
        return;
      }

      toast.success(res.message || "Image removed successfully.");
      clearPreview();
      setLocalError(null);
      onChange?.(null);
      onRemove?.();
      onBlur?.();
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      toast.error("Failed to remove image. Please try again.");
    }
  };

  const openPicker = () => {
    if (!disabled && !uploading) inputRef.current?.click();
  };

  const roundedCls = roundedMap[rounded];
  const sizeCls = sizeMap[size];

  return (
    <div className={cn(sizeCls, className)}>
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        className="sr-only"
        disabled={disabled || uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
        onBlur={onBlur}
        aria-invalid={!!showError}
      />

      {displayUrl ? (
        <div
          className={cn(
            "relative overflow-hidden border border-border bg-muted/30",
            roundedCls,
            boxClassName,
          )}
          style={{ aspectRatio: aspect }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayUrl}
            alt="Preview"
            className={cn(
              "h-full w-full object-cover",
              rounded === "full" && "rounded-full",
            )}
          />
          {uploading && (
            <div className="rounded-lg absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              {loadingContent ?? (
                <Loader2 className="size-8 animate-spin text-primary" />
              )}
            </div>
          )}
          {showActions && !uploading && !disabled && (
            <div className="absolute right-2 top-2 flex gap-1.5">
              <ImagePreviewButton
                src={displayUrl}
                alt="Image preview"
                title="View image"
                className="cursor-pointer inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background/90 text-foreground shadow-sm backdrop-blur hover:bg-muted"
              />
              <button
                type="button"
                onClick={openPicker}
                title="Replace image"
                className="cursor-pointer inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background/90 text-foreground shadow-sm backdrop-blur hover:bg-muted"
              >
                <Replace className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => void remove()}
                title="Remove image"
                className="cursor-pointer inline-flex size-8 items-center justify-center rounded-lg border border-border bg-background/90 text-destructive shadow-sm backdrop-blur hover:bg-destructive/10"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={openPicker}
          onDragOver={(e) => {
            if (!enableDrop) return;
            e.preventDefault();
            if (!disabled && !uploading) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!enableDrop || disabled || uploading) return;
            const file = e.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className={cn(
            "flex w-full flex-col cursor-pointer  items-center justify-center gap-3 border-2 border-dashed px-4 text-center transition-colors outline-none",
            roundedCls,
            "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:opacity-50",
            dragOver && "border-primary bg-primary/5",
            showError && "border-destructive",
            boxClassName,
          )}
          style={{ aspectRatio: aspect }}
        >
          {uploading
            ? (loadingContent ?? (
                <>
                  <Loader2 className="size-10 animate-spin text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Uploading…
                  </p>
                </>
              ))
            : (emptyContent ?? (
                <>
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ImagePlus className="size-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {enableDrop
                        ? "Click to upload or drag & drop"
                        : "Click to upload"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG, WEBP or GIF (max {maxSizeMB} MB)
                    </p>
                  </div>
                </>
              ))}
        </button>
      )}

      {showError && (
        <p role="alert" className="mt-1.5 text-sm text-red-500">
          {showError}
        </p>
      )}
    </div>
  );
}