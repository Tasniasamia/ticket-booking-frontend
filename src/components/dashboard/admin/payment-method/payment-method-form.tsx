"use client";

import { useEffect } from "react";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormCheckbox, FormInput, FormSelect, SubmitButton } from "@/components/common/form";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { createPaymentMethodAction, updatePaymentMethodAction } from "@/features/payment-method/actions";
import { paymentMethodSchema, type PaymentMethodInput } from "@/features/payment-method/schemas";
import { PAYMENT_CODES, credentialsToRows, type PaymentMethod } from "@/features/payment-method/types";
import { FormFieldList } from "@/components/common/form/form-field-list";
import { deleteRemovedMedia, revokePendingImages, savedIds, toImageItem, withUploadSession } from "@/features/media/deferred";

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
      logo: toImageItem(paymentMethod?.logo_url, paymentMethod?.logo_id),
      enable: paymentMethod?.enable ?? true,
      // Credential এর নাম (key) আর মান (value): দুটো ঘর, যত খুশি যোগ করা যায়
      credentials: paymentMethod ? credentialsToRows(paymentMethod.credentials) : [{ key: "", value: "" }],
    },
  });

  // Edit এ form খোলার সময় server এ যে logo ছিল। Save সফল হলে আর ব্যবহার না হলে মুছব।
  const originalMediaIds = savedIds([toImageItem(paymentMethod?.logo_url, paymentMethod?.logo_id)]);

  // Form বন্ধ হলে upload না হওয়া ছবির blob preview মুক্ত করো
  useEffect(() => () => revokePendingImages([form.getValues("logo")]), [form]);

  const onSubmit = async (values: PaymentMethodInput) => {
    const { logo } = values;
    if (!logo) return; // schema আগেই আটকায়, এটা শুধু type এর জন্য

    try {
      // ১) logo upload (select করলে শুধু preview ছিল) ২) database এ save। Save fail করলে upload হওয়া ছবি মুছে যায়।
      let finalIds: number[] = [];
      const res = await withUploadSession({ modelName: "payments", modelId: paymentMethod?.id }, async (session) => {
        const [uploaded] = await session.resolveMany([logo]);
        finalIds = savedIds([uploaded]);
        const payload: PaymentMethodInput = { ...values, logo: uploaded };
        return paymentMethod
          ? updatePaymentMethodAction(paymentMethod.id, payload)
          : createPaymentMethodAction(payload);
      });

      if (res.success) {
        // ৩) Edit এ পুরনো logo বদলালে এখন server থেকে মুছো
        if (paymentMethod) await deleteRemovedMedia(originalMediaIds, finalIds);
        toast.success(res.message ?? "Saved.");
        onSuccess?.();
        return;
      }
      toast.error(res.message ?? "Could not save.");
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
        if (v?.[0]) form.setError(k as FieldPath<PaymentMethodInput>, { message: v[0] });
      });
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-h-[75vh] space-y-4 overflow-y-auto pretty-scroll pr-1">
        <FormInput name="name" label="Name" placeholder="Stripe" />
        <FormSelect name="code" label="Gateway" options={PAYMENT_CODES} placeholder="Select a gateway" />

        {/* deferred: logo select করলে শুধু preview, upload হবে "Save" এ */}
        <FormImageUploader name="logo" label="Logo" deferred aspect="1/1" size="sm" />

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
