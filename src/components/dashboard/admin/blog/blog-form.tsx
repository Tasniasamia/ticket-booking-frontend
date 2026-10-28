"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput, FormTextarea, SubmitButton } from "@/components/common/form";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { FormMultiImageUploader } from "@/components/common/form/form-multi-image-uploader";
import { createBlogAction, updateBlogAction } from "@/features/blog/actions";
import { blogSchema, type BlogFormValues } from "@/features/blog/schemas";
import type { BlogItem } from "@/features/blog/types";
import type { Language } from "@/features/language/types";

type Props = {
  languages: Language[];
  blog?: BlogItem;
  onSuccess?: () => void;
};

const withSlots = (languages: Language[], existing: Record<string, string> = {}) => ({
  ...Object.fromEntries(languages.map((l) => [l.code, ""])),
  ...existing,
});

export function BlogForm({ languages, blog, onSuccess }: Props) {
  const isEdit = !!blog;

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    mode: "onChange",
    defaultValues: {
      title: withSlots(languages, blog?.title),
      short_description: withSlots(languages, blog?.short_description),
      long_description: withSlots(languages, blog?.long_description),
      slug: blog?.slug ?? "",
      thumbnail_id: blog?.thumbnail?.id ?? 0,
      thumbnail_url: blog?.thumbnail?.url ?? "",
      images: blog?.images ?? [],
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const res = isEdit ? await updateBlogAction(blog!.id, values) : await createBlogAction(values);
    if (res.success) {
      toast.success(res.message);
      onSuccess?.();
    } else {
      toast.error(res.message ?? "Failed");
      if (res.fieldErrors) {
        for (const [k, msgs] of Object.entries(res.fieldErrors)) {
          if (msgs?.[0]) form.setError(k as keyof BlogFormValues, { message: msgs[0] });
        }
      }
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((l) => (
            <FormInput key={`t-${l.code}`} name={`title.${l.code}`} label={`Title (${l.name})`} />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((l) => (
            <FormTextarea
              key={`s-${l.code}`}
              name={`short_description.${l.code}`}
              label={`Short description (${l.name})`}
              rows={3}
            />
          ))}
        </div>

        <div className="grid gap-4">
          {languages.map((l) => (
            <FormTextarea
              key={`l-${l.code}`}
              name={`long_description.${l.code}`}
              label={`Long description (${l.name})`}
              rows={5}
            />
          ))}
        </div>

        <FormInput name="slug" label="Slug (optional)" placeholder="auto from title if empty" />

        <FormImageUploader
          name="thumbnail_url"
          label="Thumbnail image"
          modelName="blog"
          modelId={blog?.id}
          mediaId={form.watch("thumbnail_id") || null}
          defaultPreviewUrl={form.watch("thumbnail_url") || null}
          aspect="16/9"
          size="lg"
          onUploadSuccess={(media) => {
            form.setValue("thumbnail_id", media.id, { shouldDirty: true, shouldValidate: true });
            form.setValue("thumbnail_url", media.public_url, { shouldDirty: true, shouldValidate: true });
            form.clearErrors(["thumbnail_id", "thumbnail_url"]);
          }}
          onUploadError={(message: string) => toast.error(message || "Failed to upload image.")}
          onRemove={() => {
            form.setValue("thumbnail_id", 0, { shouldDirty: true, shouldValidate: true });
            form.setValue("thumbnail_url", "", { shouldDirty: true, shouldValidate: true });
          }}
        />

        <FormMultiImageUploader
          name="images"
          label="Gallery images"
          modelName="blog"
          modelId={blog?.id}
          maxFiles={8}
          columns={4}
          aspect="1/1"
          addLabel="Add images"
        />

        <SubmitButton loadingText="Saving...">{isEdit ? "Save changes" : "Submit for approval"}</SubmitButton>
      </form>
    </FormProvider>
  );
}
