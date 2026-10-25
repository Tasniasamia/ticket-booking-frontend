"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { FormInput, SubmitButton } from "@/components/common/form";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { createEventCategoryAction, updateEventCategoryAction } from "@/features/event-category/actions";
import { eventCategorySchema, type EventCategoryFormValues } from "@/features/event-category/schemas";
import type { EventCategory } from "@/features/event-category/types";
import type { Language } from "@/features/language/types";

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
      event_category_image_url: eventCategory?.event_category_image_url ?? "",
      event_category_image_id: eventCategory?.event_category_image_id ?? 0,
    },
  });

  const onSubmit = async (values: EventCategoryFormValues) => {
    try {
      const res = eventCategory
        ? await updateEventCategoryAction(eventCategory.id, values)
        : await createEventCategoryAction(values);

      if (res.success) {
        toast.success(res.message ?? "Saved.");
        onSuccess?.();
        return;
      }

      toast.error(res.message ?? "Could not save.");
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
        if (v?.[0]) form.setError(k as FieldPath<EventCategoryFormValues>, { message: v[0] });
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
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

        <FormImageUploader
          name="event_category_image_url"
          label="Category Image"
          modelName="event_categories" // backend এর model নাম অনুযায়ী মিলিয়ে নাও
          modelId={eventCategory?.id}
          mediaId={form.watch("event_category_image_id") || null}
          defaultPreviewUrl={form.watch("event_category_image_url") || null}
          aspect="1/1"
          size="md"
          onUploadSuccess={(media) => {
            form.setValue("event_category_image_id", media.id, { shouldDirty: true, shouldValidate: true });
            form.setValue("event_category_image_url", media.public_url, { shouldDirty: true, shouldValidate: true });
            form.clearErrors(["event_category_image_url", "event_category_image_id"]);
          }}
          onUploadError={(message: string) => toast.error(message || "Failed to upload image.")}
          onRemove={() => {
            form.setValue("event_category_image_id", 0, { shouldDirty: true });
            form.setValue("event_category_image_url", "", { shouldDirty: true });
            form.clearErrors(["event_category_image_url", "event_category_image_id"]);
          }}
        />

        <SubmitButton loadingText="Saving...">{isEdit ? "Save changes" : "Create event category"}</SubmitButton>
      </form>
    </FormProvider>
  );
}