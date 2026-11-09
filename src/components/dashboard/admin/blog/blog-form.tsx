"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { FormInput, FormTextarea, SubmitButton } from "@/components/common/form";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { FormMultiImageUploader } from "@/components/common/form/form-multi-image-uploader";
import { createBlogAction, updateBlogAction } from "@/features/blog/actions";
import { blogSchema, type BlogFormValues } from "@/features/blog/schemas";
import type { BlogItem } from "@/features/blog/types";
import type { Language } from "@/features/language/types";
import { deleteRemovedMedia, revokePendingImages, savedIds, withUploadSession } from "@/features/media/deferred";

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
      thumbnail: blog?.thumbnail ?? null,
      images: blog?.images ?? [],
    },
  });

  // Edit এ form খোলার সময় server এ যে ছবিগুলো ছিল। Save সফল হলে যেগুলো আর নেই সেগুলো মুছব।
  const originalMediaIds = savedIds([blog?.thumbnail, ...(blog?.images ?? [])]);

  // Form বন্ধ হলে upload না হওয়া ছবির blob preview মুক্ত করো
  useEffect(
    () => () => {
      const { thumbnail, images } = form.getValues();
      revokePendingImages([thumbnail, ...images]);
    },
    [form],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    const { thumbnail } = values;
    if (!thumbnail) return; // schema আগেই আটকায়, এটা শুধু type এর জন্য

    try {
      // ১) ছবি upload (select করলে শুধু preview ছিল) ২) database এ save। Save fail করলে upload হওয়া ছবি মুছে যায়।
      let finalIds: number[] = [];
      const res = await withUploadSession({ modelName: "blog", modelId: blog?.id }, async (session) => {
        const [thumb, ...gallery] = await session.resolveMany([thumbnail, ...values.images]);
        finalIds = savedIds([thumb, ...gallery]);
        const payload: BlogFormValues = { ...values, thumbnail: thumb, images: gallery };
        return blog ? updateBlogAction(blog.id, payload) : createBlogAction(payload);
      });

      if (res.success) {
        // ৩) Edit এ যে পুরনো ছবি আর ব্যবহার হচ্ছে না সেগুলো এখন server থেকে মুছো
        if (blog) await deleteRemovedMedia(originalMediaIds, finalIds);
        toast.success(res.message);
        onSuccess?.();
        return;
      }

      toast.error(res.message ?? "Failed");
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
        if (v?.[0]) form.setError(k as FieldPath<BlogFormValues>, { message: v[0] });
      });
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
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

        {/* deferred: ছবি select করলে শুধু preview, upload হবে "Save" এ */}
        <FormImageUploader name="thumbnail" label="Thumbnail image" deferred aspect="16/9" size="lg" />

        <FormMultiImageUploader
          name="images"
          label="Gallery images"
          deferred
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
