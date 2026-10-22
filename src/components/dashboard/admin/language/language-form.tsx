"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormCheckbox, FormInput, SubmitButton } from "@/components/common/form";
import { createLanguageAction, updateLanguageAction } from "@/features/language/actions";
import { languageSchema, type LanguageInput } from "@/features/language/schemas";
import type { Language } from "@/features/language/types";

type Props = {
  /** দিলে Edit, না দিলে Create */
  language?: Language;
  /** Save সফল হলে ডাকা হয় (dialog বন্ধ + table refresh) */
  onSuccess?: () => void;
};

/** Create আর Edit একই form। */
export function LanguageForm({ language, onSuccess }: Props) {
  const isEdit = !!language;
  const form = useForm<LanguageInput>({
    resolver: zodResolver(languageSchema),
    mode: "onChange",
    defaultValues: {
      name: language?.name ?? "",
      code: language?.code ?? "",
      rtl: language?.rtl ?? false,
      isActive: language?.isActive ?? true,
      isDefault: language?.isDefault ?? false,
      flag: language?.flag ?? "",
    },
  });

  const onSubmit = async (values: LanguageInput) => {
    const res = language ? await updateLanguageAction(language.id, values) : await createLanguageAction(values);
    if (res.success) {
      toast.success(res.message ?? "Saved.");
      onSuccess?.();
      return;
    }
    toast.error(res.message ?? "Could not save.");
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
      if (v?.[0]) form.setError(k as keyof LanguageInput, { message: v[0] });
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* code বদলালে translation এর values এর key গুলো এতিম হয়ে যায়, তাই edit এ readOnly */}
          <FormInput name="code" label="Code" placeholder="bn" readOnly={isEdit} className={isEdit ? "opacity-60" : "lowercase"} />
          <FormInput name="flag" label="Flag (optional)" placeholder="🇧🇩" />
        </div>
        <FormInput name="name" label="Name" placeholder="বাংলা" />
        <div className="space-y-3">
          <FormCheckbox name="rtl" label="Right-to-left script (Arabic, Urdu...)" />
          {/* default language কে inactive করা যায় না, তাই তার জন্য এই দুটো লুকানো */}
          {!language?.isDefault && <FormCheckbox name="isActive" label="Active (visible in the language switcher)" />}
          {!language?.isDefault && <FormCheckbox name="isDefault" label="Set as the site default language" />}
        </div>
        <SubmitButton loadingText="Saving...">{isEdit ? "Save changes" : "Add language"}</SubmitButton>
      </form>
    </FormProvider>
  );
}
