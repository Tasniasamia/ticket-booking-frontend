"use client";

import { useEffect } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import type { Testimonial } from "@/features/testimonial/types";
import {
  createTestimonialAction,
  updateTestimonialAction,
} from "@/features/testimonial/actions";
import {
  testimonialSchema,
  type TestimonialInput,
} from "@/features/testimonial/schemas";
import { FormInput } from "@/components/common/form/form-input";
import { FormTextarea } from "@/components/common/form/form-textarea";
import { FormCheckbox } from "@/components/common/form/form-checkbox";
import { SubmitButton } from "@/components/common/form/submit-button";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { deleteRemovedMedia, revokePendingImages, savedIds, toImageItem, withUploadSession } from "@/features/media/deferred";

export function TestimonialForm({
  item,
  onSuccess,
}: {
  item?: Testimonial;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const form = useForm<TestimonialInput>({
    // RHF + zod কখনো input/output mismatch করে — explicit cast
    resolver: zodResolver(testimonialSchema) as Resolver<TestimonialInput>,
    defaultValues: {
      name: item?.name ?? "",
      role: item?.role ?? "",
      text: item?.text ?? "",
      image: toImageItem(item?.image_url, item?.image_id),
      is_active: item?.is_active ?? true,
      sort_order: item?.sort_order ?? 0,
    },
  });

  // Edit এ form খোলার সময় server এ যে ছবি ছিল। Save সফল হলে আর ব্যবহার না হলে মুছব।
  const originalMediaIds = savedIds([toImageItem(item?.image_url, item?.image_id)]);

  // Form বন্ধ হলে upload না হওয়া ছবির blob preview মুক্ত করো
  useEffect(() => () => revokePendingImages([form.getValues("image")]), [form]);

  // এখানে আলাদা onSubmit(e) বানাবে না — সরাসরি handleSubmit-এর ভিতরে
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      // ১) ছবি upload (select করলে শুধু preview ছিল) ২) database এ save। Save fail করলে upload হওয়া ছবি মুছে যায়।
      let finalIds: number[] = [];
      const res = await withUploadSession({ modelName: "testimonial", modelId: item?.id }, async (session) => {
        const [image] = values.image ? await session.resolveMany([values.image]) : [null];
        finalIds = savedIds([image]);
        const payload: TestimonialInput = { ...values, image };
        return item ? updateTestimonialAction(item.id, payload) : createTestimonialAction(payload);
      });

      if (res.success) {
        // ৩) Edit এ পুরনো ছবি বদলালে/সরালে এখন server থেকে মুছো
        if (item) await deleteRemovedMedia(originalMediaIds, finalIds);
        toast.success(res.message ?? "Saved.");
        onSuccess?.();
        router.refresh();
        return;
      }
      toast.error(res.message ?? "Failed.");
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput name="name" label="Name" placeholder="Customer name" />
          <FormInput name="role" label="Role" placeholder="Concert-goer" />
        </div>

        <FormTextarea name="text" label="Text" rows={4} placeholder="Review text" />

        {/* deferred: ছবি select করলে শুধু preview, upload হবে "Save" এ */}
        <FormImageUploader name="image" label="Photo" deferred aspect="1/1" size="md" />

        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput name="sort_order" label="Sort order" type="number" placeholder="0" />
          <div className="self-end pb-1">
            <FormCheckbox name="is_active" label="Active" />
          </div>
        </div>

        <SubmitButton loadingText="Saving...">
          {item ? "Save changes" : "Create testimonial"}
        </SubmitButton>
      </form>
    </FormProvider>
  );
}
