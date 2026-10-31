// "use client";

// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import type { Testimonial } from "@/features/testimonial/types";
// import {
//   createTestimonialAction,
//   updateTestimonialAction,
// } from "@/features/testimonial/actions";
// import {
//   testimonialSchema,
//   type TestimonialInput,
// } from "@/features/testimonial/schemas";
// import { FormInput } from "@/components/common/form/form-input";
// import { FormTextarea } from "@/components/common/form/form-textarea";
// import { FormCheckbox } from "@/components/common/form/form-checkbox";
// import { SubmitButton } from "@/components/common/form/submit-button";
// import { FormImageUploader } from "@/components/common/form/form-image-uploader";

// export function TestimonialForm({
//   item,
//   onSuccess,
// }: {
//   item?: Testimonial;
//   onSuccess?: () => void;
// }) {
//   const router = useRouter();

// const form = useForm<TestimonialInput>({
//   resolver: zodResolver(testimonialSchema),
//   defaultValues: {
//     name: item?.name ?? "",
//     role: item?.role ?? "",
//     text: item?.text ?? "",
//     image_id: item?.image_id ?? 0,
//     image_url: item?.image_url ?? "",
//     is_active: item?.is_active ?? true,
//     sort_order: item?.sort_order ?? 0,
//   },
// });

// const onSubmit = form.handleSubmit(async (values) => {
//   // values এখন TestimonialInput — error থাকবে না
//   const res = item
//     ? await updateTestimonialAction(item.id, values)
//     : await createTestimonialAction(values);

//   if (res.success) {
//     toast.success(res.message ?? "Saved.");
//     onSuccess?.();
//     router.refresh();
//     return;
//   }
//   toast.error(res.message ?? "Failed.");
// });

//   return (
//     <FormProvider {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" noValidate>
//         <div className="grid gap-3 sm:grid-cols-2">
//           <FormInput name="name" label="Name" placeholder="Customer name" />
//           <FormInput name="role" label="Role" placeholder="Concert-goer" />
//         </div>

//         <FormTextarea name="text" label="Text" rows={4} placeholder="Review text" />

//         {/* Blog form-এর মতো single image upload */}
//         <FormImageUploader
//           name="image_url"
//           label="Photo"
//           modelName="testimonial"
//           modelId={item?.id}
//           mediaId={form.watch("image_id") || null}
//           defaultPreviewUrl={form.watch("image_url") || null}
//           aspect="1/1"
//           size="md"
//           rounded="full"
//           onUploadSuccess={(media) => {
//             form.setValue("image_id", media.id, { shouldDirty: true, shouldValidate: true });
//             form.setValue("image_url", media.public_url, {
//               shouldDirty: true,
//               shouldValidate: true,
//             });
//             form.clearErrors(["image_id", "image_url"]);
//           }}
//           onUploadError={(message: string) =>
//             toast.error(message || "Failed to upload image.")
//           }
//           onRemove={() => {
//             form.setValue("image_id", 0, { shouldDirty: true, shouldValidate: true });
//             form.setValue("image_url", "", { shouldDirty: true, shouldValidate: true });
//           }}
//         />

//         <div className="grid gap-3 sm:grid-cols-2">
//           <FormInput name="sort_order" label="Sort order" type="number" placeholder="0" />
//           <div className="self-end pb-1">
//             <FormCheckbox name="is_active" label="Active" />
//           </div>
//         </div>

//         <SubmitButton loadingText="Saving...">
//           {item ? "Save changes" : "Create testimonial"}
//         </SubmitButton>
//       </form>
//     </FormProvider>
//   );
// }


"use client";

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
      image_id: item?.image_id ?? 0,
      image_url: item?.image_url ?? "",
      is_active: item?.is_active ?? true,
      sort_order: item?.sort_order ?? 0,
    },
  });

  // এখানে আলাদা onSubmit(e) বানাবে না — সরাসরি handleSubmit-এর ভিতরে
  const onSubmit = form.handleSubmit(async (values) => {
    const res = item
      ? await updateTestimonialAction(item.id, values)
      : await createTestimonialAction(values);

    if (res.success) {
      toast.success(res.message ?? "Saved.");
      onSuccess?.();
      router.refresh();
      return;
    }
    toast.error(res.message ?? "Failed.");
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput name="name" label="Name" placeholder="Customer name" />
          <FormInput name="role" label="Role" placeholder="Concert-goer" />
        </div>

        <FormTextarea name="text" label="Text" rows={4} placeholder="Review text" />

        <FormImageUploader
          name="image_url"
          label="Photo"
          modelName="testimonial"
          modelId={item?.id}
          mediaId={form.watch("image_id") || null}
          defaultPreviewUrl={form.watch("image_url") || null}
          aspect="1/1"
          size="md"
          // rounded="full"
          onUploadSuccess={(media) => {
            form.setValue("image_id", media.id, { shouldDirty: true, shouldValidate: true });
            form.setValue("image_url", media.public_url, {
              shouldDirty: true,
              shouldValidate: true,
            });
            form.clearErrors(["image_id", "image_url"]);
          }}
          onUploadError={(message: string) =>
            toast.error(message || "Failed to upload image.")
          }
          onRemove={() => {
            form.setValue("image_id", 0, { shouldDirty: true, shouldValidate: true });
            form.setValue("image_url", "", { shouldDirty: true, shouldValidate: true });
          }}
        />

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