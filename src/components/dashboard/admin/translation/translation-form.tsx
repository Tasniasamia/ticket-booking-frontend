"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormError, FormInput, FormTextarea, SubmitButton } from "@/components/common/form";
import { createTranslationAction, updateTranslationAction } from "@/features/translation/actions";
import { translationSchema, type TranslationInput } from "@/features/translation/schemas";
import type { Translation } from "@/features/translation/types";
import type { Language } from "@/features/language/types";

type Props = {
  /** Edit mode when set; key is the English static text */
  translation?: Translation;
  languages: Language[];
  onSuccess?: () => void;
};

/**
 * modify2 style: key = English text (read-only on edit).
 * Fill values for each active language. Empty = fall back to English key.
 */
export function TranslationForm({ translation, languages, onSuccess }: Props) {
  const isEdit = !!translation;
  const form = useForm<TranslationInput>({
    resolver: zodResolver(translationSchema),
    mode: "onSubmit",
    defaultValues: {
      key: translation?.key ?? "",
      values: Object.fromEntries(languages.map((l) => [l.code, translation?.values[l.code] ?? ""])),
    },
  });

  const onSubmit = async (input: TranslationInput) => {
    const res = translation
      ? await updateTranslationAction(translation.key, input)
      : await createTranslationAction(input);
    if (res.success) {
      toast.success(res.message ?? "Saved.");
      onSuccess?.();
      return;
    }
    toast.error(res.message ?? "Could not save.");
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
      if (v?.[0]) form.setError(k as keyof TranslationInput, { message: v[0] });
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormInput
          name="key"
          label="English text (key)"
          placeholder="e.g. Home, Log in, Book now"
          readOnly={isEdit}
          className={isEdit ? "opacity-60" : ""}
        />
        <p className="text-xs text-fg/50 -mt-2">
          This exact English text is what you use in code: t(&quot;Home&quot;) or &lt;T k=&quot;Home&quot; /&gt;
        </p>
        <div className="max-h-[52vh] space-y-4 overflow-y-auto pr-1">
          {languages.map((l) => (
            <FormTextarea
              key={l.code}
              name={`values.${l.code}`}
              label={`${l.name} (${l.code})${l.isDefault ? " · default" : ""}`}
              dir={l.rtl ? "rtl" : "ltr"}
              rows={2}
              placeholder={l.code === "en" ? "Same as English text if empty" : `Translation in ${l.name}`}
            />
          ))}
        </div>
        <FormError name="values" />
        <SubmitButton loadingText="Saving...">{isEdit ? "Save translations" : "Add text"}</SubmitButton>
      </form>
    </FormProvider>
  );
}
