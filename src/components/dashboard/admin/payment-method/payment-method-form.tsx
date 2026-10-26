"use client";

import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormCheckbox, FormInput, FormSelect, SubmitButton } from "@/components/common/form";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { createPaymentMethodAction, updatePaymentMethodAction } from "@/features/payment-method/actions";
import { paymentMethodSchema, type PaymentMethodInput } from "@/features/payment-method/schemas";
import { PAYMENT_CODES, credentialsToRows, type PaymentMethod } from "@/features/payment-method/types";
import { FormFieldList } from "@/components/common/form/form-field-list";

type Props = {
  /** দিলে Edit, না দিলে Create */
  paymentMethod?: PaymentMethod;
  /** Save সফল হলে ডাকা হয় (dialog বন্ধ + table refresh) */
  onSuccess?: () => void;
};

export function PaymentMethodForm({ paymentMethod, onSuccess }: Props) {
  const isEdit = !!paymentMethod;

  const form = useForm<PaymentMethodInput>({
    resolver: zodResolver(paymentMethodSchema),
    mode: "onChange",
    defaultValues: {
      name: paymentMethod?.name ?? "",
      code: (paymentMethod?.code as PaymentMethodInput["code"]) ?? undefined,
      logo_url: paymentMethod?.logo_url ?? "",
      logo_id: paymentMethod?.logo_id ?? 0,
      enable: paymentMethod?.enable ?? true,
      // Credential এর নাম (key) আর মান (value): দুটো ঘর, যত খুশি যোগ করা যায়
      credentials: paymentMethod ? credentialsToRows(paymentMethod.credentials) : [{ key: "", value: "" }],
    },
  });

  const onSubmit = async (values: PaymentMethodInput) => {
    
    try {
      console.log(paymentMethod?.id,values);
      const res = paymentMethod ? await updatePaymentMethodAction(paymentMethod.id, values) : await createPaymentMethodAction(values);
      if (res.success) {
        toast.success(res.message ?? "Saved.");
        onSuccess?.();
        return;
      }
      toast.error(res.message ?? "Could not save.");
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
        if (v?.[0]) form.setError(k as FieldPath<PaymentMethodInput>, { message: v[0] });
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-h-[75vh] space-y-4 overflow-y-auto pretty-scroll pr-1">
        <FormInput name="name" label="Name" placeholder="Stripe" />
        <FormSelect name="code" label="Gateway" options={PAYMENT_CODES} placeholder="Select a gateway" />

        <FormImageUploader
          name="logo_url"
          label="Logo"
          modelName="payments"
          modelId={paymentMethod?.id}
          mediaId={form.watch("logo_id") || null}
          defaultPreviewUrl={form.watch("logo_url") || null}
          aspect="1/1"
          size="sm"
          onUploadSuccess={(media) => {
            form.setValue("logo_id", media.id, { shouldDirty: true, shouldValidate: true });
            form.setValue("logo_url", media.public_url, { shouldDirty: true, shouldValidate: true });
            form.clearErrors(["logo_url", "logo_id"]);
          }}
          onUploadError={(message: string) => toast.error(message || "Failed to upload image.")}
          onRemove={() => {
            form.setValue("logo_id", 0, { shouldDirty: true });
            form.setValue("logo_url", "", { shouldDirty: true });
            form.clearErrors(["logo_url", "logo_id"]);
          }}
        />

        <FormFieldList
          name="credentials"
          label="Credentials"
          layout="stacked"
          columns={[
            { name: "key", placeholder: "key (e.g. secret_key)" },
            { name: "value", placeholder: "value" },
          ]}
          addLabel="+ Add Credential"
          minRows={1}
        />

        <FormCheckbox name="enable" label="Enabled (customers can pay with it)" />

        <SubmitButton loadingText="Saving...">{isEdit ? "Save changes" : "Create payment method"}</SubmitButton>
      </form>
    </FormProvider>
  );
}
