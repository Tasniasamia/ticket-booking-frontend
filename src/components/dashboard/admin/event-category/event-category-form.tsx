"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { FormInput, SubmitButton } from "@/components/common/form";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { createEventCategoryAction, updateEventCategoryAction } from "@/features/event-category/actions";
import { eventCategorySchema, type EventCategoryFormValues } from "@/features/event-category/schemas";
import type { EventCategory } from "@/features/event-category/types";
import type { Language } from "@/features/language/types";
import {
  deleteRemovedMedia,
  revokePendingImages,
  savedIds,
  toImageItem,
  withUploadSession,
} from "@/features/media/deferred";

type Props = {
  /** Active language গুলো, default সবার আগে */
  languages: Language[];
  /** দিলে Edit, না দিলে Create */
  eventCategory?: EventCategory;
  /** Save সফল হলে ডাকা হয় (dialog বন্ধ + table refresh) */
  onSuccess?: () => void;
};

// সব active language এর জন্য ফাঁকা slot, তার উপর বসে আগের data।
// আগের data র যে language এখন disabled, সেটাও থাকে, তাই save এ মুছে যায় না।
const withSlots = (languages: Language[], existing: Record<string, string> = {}) => ({
  ...Object.fromEntries(languages.map((l) => [l.code, ""])),
  ...existing,
});

export function EventCategoryForm({ languages, eventCategory, onSuccess }: Props) {
  const isEdit = !!eventCategory;

  const form = useForm<EventCategoryFormValues>({
    resolver: zodResolver(eventCategorySchema),
    mode: "onChange",
    defaultValues: {
      name: withSlots(languages, eventCategory?.name),
      description: withSlots(languages, eventCategory?.description),
      image: toImageItem(eventCategory?.event_category_image_url, eventCategory?.event_category_image_id),
    },
  });

  // Edit এ form খোলার সময় server এ যে ছবি ছিল। Save সফল হলে আর ব্যবহার না হলে মুছব।
  const originalMediaIds = savedIds([toImageItem(eventCategory?.event_category_image_url, eventCategory?.event_category_image_id)]);

  // Form বন্ধ হলে upload না হওয়া ছবির blob preview মুক্ত করো
  useEffect(() => () => revokePendingImages([form.getValues("image")]), [form]);

  const onSubmit = async (values: EventCategoryFormValues) => {
    try {
      // ১) ছবি upload (select করলে শুধু preview ছিল) ২) database এ save। Save fail করলে upload হওয়া ছবি মুছে যায়।
      let finalId = 0;
      const res = await withUploadSession(
        { modelName: "event_categories", modelId: eventCategory?.id },
        async (session) => {
          const [image] = values.image ? await session.resolveMany([values.image]) : [null];
          finalId = image?.id ?? 0;
          const payload: EventCategoryFormValues = { ...values, image };
          return eventCategory
            ? updateEventCategoryAction(eventCategory.id, payload)
            : createEventCategoryAction(payload);
        },
      );

      if (res.success) {
        // ৩) Edit এ পুরনো ছবি বদলালে/সরালে এখন server থেকে মুছো
        if (eventCategory) await deleteRemovedMedia(originalMediaIds, finalId > 0 ? [finalId] : []);
        toast.success(res.message ?? "Saved.");
        onSuccess?.();
        return;
      }

      toast.error(res.message ?? "Could not save.");
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
        if (v?.[0]) form.setError(k as FieldPath<EventCategoryFormValues>, { message: v[0] });
      });
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((l) => (
            <FormInput key={`name-${l.code}`} name={`name.${l.code}`} label={`Name (${l.name})`} />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((l) => (
            <FormInput key={`desc-${l.code}`} name={`description.${l.code}`} label={`Description (${l.name})`} />
          ))}
        </div>

        {/* deferred: ছবি select করলে শুধু preview, upload হবে "Save" এ */}
        <FormImageUploader name="image" label="Category Image" deferred aspect="1/1" size="md" />

        <SubmitButton loadingText="Saving...">{isEdit ? "Save changes" : "Create event category"}</SubmitButton>
      </form>
    </FormProvider>
  );
}