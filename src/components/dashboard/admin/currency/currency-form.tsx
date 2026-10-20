"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormCheckbox, FormInput, FormSelect, SubmitButton } from "@/components/common/form";
import { createCurrencyAction, updateCurrencyAction } from "@/features/currency/actions";
import { currencySchema, type CurrencyInput } from "@/features/currency/schemas";
import type { Currency } from "@/features/currency/types";

const STATUS_OPTIONS = [
  { value: "enable", label: "Enabled" },
  { value: "disable", label: "Disabled" },
];

type Props = {
  /** দিলে Edit, না দিলে Create */
  currency?: Currency;
  /** Save সফল হলে ডাকা হয় (dialog বন্ধ + table refresh) */
  onSuccess?: () => void;
};

/** Create আর Edit একই form। Dialog এ বা আলাদা page এ, যেখানে খুশি বসানো যায়। */
export function CurrencyForm({ currency, onSuccess }: Props) {
  const isEdit = !!currency;
  const form = useForm<CurrencyInput>({
    resolver: zodResolver(currencySchema),
    mode: "onChange",
    defaultValues: {
      code: currency?.code ?? "",
      name: currency?.name ?? "",
      symbol: currency?.symbol ?? "",
      rateToBDT: currency?.rateToBDT,
      status: currency?.status === "disable" ? "disable" : "enable",
      isDefault: currency?.isDefault ?? false,
    },
  });

  const onSubmit = async (values: CurrencyInput) => {
    const res = currency ? await updateCurrencyAction(currency.id, values) : await createCurrencyAction(values);
    if (res.success) {
      toast.success(res.message ?? "Saved.");
      onSuccess?.();
      return;
    }
    toast.error(res.message ?? "Could not save.");
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
      if (v?.[0]) form.setError(k as keyof CurrencyInput, { message: v[0] });
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* backend এ code বদলানো যায় না, তাই edit এ readOnly */}
          <FormInput name="code" label="Code" placeholder="USD" readOnly={isEdit} className={isEdit ? "opacity-60" : "uppercase"} />
          <FormInput name="symbol" label="Symbol" placeholder="$" />
        </div>
        <FormInput name="name" label="Name" placeholder="US Dollar" />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput name="rateToBDT" label="Rate to BDT" type="number" step="any" placeholder="122.5" />
          <FormSelect name="status" label="Status" options={STATUS_OPTIONS} />
        </div>
        {/* backend এ default শুধু create এ বসে; পরে বদলাতে set-default আলাদা endpoint */}
        {!isEdit && <FormCheckbox name="isDefault" label="Set as default currency" />}
        <SubmitButton loadingText="Saving...">{isEdit ? "Save changes" : "Create currency"}</SubmitButton>
      </form>
    </FormProvider>
  );
}
