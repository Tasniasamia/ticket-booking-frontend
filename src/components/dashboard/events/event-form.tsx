"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormProvider, useForm, type FieldErrors, type FieldPath } from "react-hook-form";
import { FormInput, FormSelect, FormTextarea, SubmitButton } from "@/components/common/form";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { FormMultiImageUploader } from "@/components/common/form/form-multi-image-uploader";
import { createEventAction, updateEventAction } from "@/features/event/actions";
import {
  createUploadSession,
  deleteRemovedMedia,
  isPendingImage,
  revokePendingImage,
} from "@/features/media/deferred";
import { eventSchema, type EventFormValues } from "@/features/event/schemas";
import type { EventItem } from "@/features/event/types";
import type { Language } from "@/features/language/types";
import type { Currency } from "@/features/currency/types";

export type CategoryOption = { value: string; label: string };

type Props = {
  /** Active language গুলো, default সবার আগে */
  languages: Language[];
  categories: CategoryOption[];
  currencies: Currency[];
  /** দিলে Edit, না দিলে Create */
  event?: EventItem;
  onSuccess?: () => void;
};

// সব active language এর জন্য ফাঁকা slot, তার উপর বসে আগের data।
// যে language এখন disabled সেটাও থাকে, তাই save এ মুছে যায় না।
const withSlots = (languages: Language[], existing: Record<string, string> = {}) => ({
  ...Object.fromEntries(languages.map((l) => [l.code, ""])),
  ...existing,
});

export function EventForm({ languages, categories, currencies, event, onSuccess }: Props) {
  const isEdit = !!event;
  const defaultCurrency = currencies.find((c) => c.isDefault)?.code ?? currencies[0]?.code ?? "BDT";

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    defaultValues: {
      title: withSlots(languages, event?.title),
      description: withSlots(languages, event?.description),
      location: withSlots(languages, event?.location),
      starts_at: event ? dayjs(event.starts_at).format("YYYY-MM-DDTHH:mm") : "",
      total_tickets: event?.total_tickets,
      price: event?.price ?? 0,
      currency: event?.currency ?? defaultCurrency,
      category_id: event?.category_id ? String(event.category_id) : "",
      thumbnail: event?.thumbnail ?? null,
      images: event?.images ?? [],
    },
  });

  // Edit এ form খোলার সময় server এ যে ছবিগুলো ছিল। Save সফল হলে যেগুলো আর নেই সেগুলো মুছব।
  const originalMediaIds = [event?.thumbnail?.id, ...(event?.images ?? []).map((i) => i.id)].filter(
    (id): id is number => typeof id === "number" && id > 0,
  );

  // Form বন্ধ হলে upload না হওয়া ছবির blob preview মুক্ত করো
  useEffect(
    () => () => {
      const { thumbnail, images } = form.getValues();
      [thumbnail, ...images].forEach((img) => {
        if (isPendingImage(img)) revokePendingImage(img);
      });
    },
    [form],
  );

  const currencyOptions = currencies.map((c) => ({ value: c.code, label: `${c.code} (${c.symbol})` }));
  // event এর currency এখন disabled হলেও select এ যেন থাকে
  if (event && !currencyOptions.some((o) => o.value === event.currency)) {
    currencyOptions.push({ value: event.currency, label: event.currency });
  }

  // Validation fail হলে আগে কিছুই দেখা যেত না, এখন কোন field এ সমস্যা সেটা বলে দেয়
  const onInvalid = (errors: FieldErrors<EventFormValues>) => {
    console.error("Event form validation errors:", errors);
    const first = Object.entries(errors)[0];
    const msg = (first?.[1] as { message?: string } | undefined)?.message;
    toast.error(msg ? `${first[0]}: ${msg}` : "Please check the highlighted fields.");
  };

  const onSubmit = async (values: EventFormValues) => {
    const { thumbnail } = values;
    if (!thumbnail) return; // schema আগেই আটকায়, এটা শুধু type এর জন্য

    // এই submit এ যা upload হবে সব এখানে ধরা থাকে, save fail করলে সব মুছে ফেলব
    const session = createUploadSession({ modelName: "event", modelId: event?.id });
    let saved = false;

    try {
      // ১) যে ছবিগুলো এখনো upload হয়নি সেগুলো cloud এ upload (server এর ছবি আবার upload হয় না)
      const [thumb, ...gallery] = await session.resolveMany([thumbnail, ...values.images]);

      // datetime-local এর value browser এর timezone এ, এখানেই ISO (UTC) বানিয়ে নিই
      const payload: EventFormValues = {
        ...values,
        starts_at: dayjs(values.starts_at).toISOString(),
        thumbnail: thumb,
        images: gallery,
      };

      // ২) তারপর database এ save
      const res = event ? await updateEventAction(event.id, payload) : await createEventAction(payload);

      if (res.success) {
        saved = true;
        // ৩) Edit এ যে পুরনো ছবি আর ব্যবহার হচ্ছে না সেগুলো এখন server থেকে মুছো
        if (event) await deleteRemovedMedia(originalMediaIds, [thumb.id, ...gallery.map((g) => g.id)]);
        toast.success(res.message ?? "Saved.");
        onSuccess?.();
        return;
      }

      await session.rollback();
      toast.error(res.message ?? "Could not save.");
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
        if (v?.[0]) form.setError(k as FieldPath<EventFormValues>, { message: v[0] });
      });
    } catch (err) {
      // Save সফল হয়ে গেলে ছবি মুছব না (ওগুলো এখন event এ ব্যবহার হচ্ছে)
      if (!saved) await session.rollback();
      toast.error(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate className="space-y-5">
        {!isEdit && (
          <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            New events stay <b>pending</b> until an admin approves them.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((l) => (
            <FormInput key={`title-${l.code}`} name={`title.${l.code}`} label={`Title (${l.name})`} />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((l) => (
            <FormTextarea key={`desc-${l.code}`} name={`description.${l.code}`} label={`Description (${l.name})`} />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {languages.map((l) => (
            <FormInput key={`loc-${l.code}`} name={`location.${l.code}`} label={`Location (${l.name})`} />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput name="starts_at" label="Date and time" type="datetime-local" />
          <FormSelect name="category_id" label="Category" options={categories} placeholder="Select a category" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormInput
            name="total_tickets"
            label="Total tickets"
            type="number"
            min={1}
            // টিকিট বিক্রি শুরু হলে total বদলালে available এর হিসাব গোলমাল হয়, তাই Edit এ বদলানো যায় না
            readOnly={isEdit}
            className={isEdit ? "opacity-60" : undefined}
          />
          <FormInput name="price" label="Price" type="number" min={0} />
          <FormSelect name="currency" label="Currency" options={currencyOptions} />
        </div>

        {/* deferred: ছবি select করলে শুধু preview, upload হবে "Submit/Save" এ */}
        <FormImageUploader
          name="thumbnail"
          label="Thumbnail image"
          deferred
          aspect="16/9"
          size="lg"
        />

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
