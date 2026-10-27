"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormError, FormInput, FormRadio } from "@/components/common/form";
import { Price } from "@/components/shared/price";
import { createCheckoutAction } from "@/features/booking/actions";
import { bookingSchema, type BookingInput } from "@/features/booking/schemas";
import type { EventItem } from "@/features/event/types";
import type { PublicPaymentMethod } from "@/features/payment-method/types";
import { cn } from "@/lib/utils";
import { useT } from "@/providers/preferences-provider";
import { useUser } from "@/providers/user-provider";

export type BookingAvailability = "open" | "sold_out" | "ended";

const MAX_PER_BOOKING = 10;
const step = "cursor-pointer glass grid size-10 place-items-center rounded-full hover:bg-fg/10 disabled:cursor-not-allowed disabled:opacity-40";
const ctaClass = "btn-grad mt-6 block w-full cursor-pointer rounded-full py-3.5 text-center font-semibold disabled:cursor-not-allowed disabled:opacity-60";

// profile থেকে যে field গুলো আগে থেকে বসাই
const PREFILL = {
  customer_name: "name",
  customer_email: "email",
  customer_phone_number: "phone_number",
  customer_address: "address",
  country: "country",
} as const;


export function BookingPanel({
  event,
  paymentMethods,
  availability,
}: {
  event: EventItem;
  paymentMethods: PublicPaymentMethod[];
  availability: BookingAvailability;
}) {
  const t = useT();
  const { user, status } = useUser();
  const [redirecting, setRedirecting] = useState(false);

  const maxQty = Math.max(1, Math.min(MAX_PER_BOOKING, event.available_tickets));
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      event_id: event.id,
      quantity: 1,
      payment_method: paymentMethods[0]?.code ?? "",
      customer_name: "",
      customer_email: "",
      customer_phone_number: "",
      customer_address: "",
      country: "",
      postcode: "",
    },
  });
  const { watch, setValue, getValues, handleSubmit, formState } = form;
  const qty = watch("quantity");

  // login করা user এর তথ্য বসাই (user নিজে কিছু লিখে থাকলে মুছি না)
  useEffect(() => {
    if (!user) return;
    for (const [field, key] of Object.entries(PREFILL) as [keyof typeof PREFILL, (typeof PREFILL)[keyof typeof PREFILL]][]) {
      const value = user[key];
      if (value && !getValues(field)) setValue(field, value);
    }
  }, [user, getValues, setValue]);

  // push update এ ticket কমে গেলে user এর বাছা সংখ্যা যেন maxQty এর বেশি না থাকে
  useEffect(() => {
    if (getValues("quantity") > maxQty) setValue("quantity", maxQty);
  }, [maxQty, getValues, setValue]);

  const onSubmit = async (values: BookingInput) => {
    const res = await createCheckoutAction(values);
    if (!res.success || !res.checkoutUrl) {
      toast.error(res.message ?? t("Could not start the payment. Please try again."));
      return;
    }
    setRedirecting(true);
    // window.location.assign(res.checkoutUrl); // Stripe / SSLCommerz
    window.open(res.checkoutUrl, "_blank");
  };

  const summary = (
    <>
      <p className="text-sm text-fg/60">{t("Price per ticket")}</p>
      <p className="text-grad text-4xl font-extrabold"><Price amount={event.price} from={event.currency} /></p>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-medium">{t("Tickets")}</span>
        <div className="flex items-center gap-3">
          <button type="button" className={step} aria-label={t("Fewer tickets")} disabled={qty <= 1} onClick={() => setValue("quantity", qty - 1)}><Minus className="size-4" /></button>
          <span className="w-6 text-center font-bold" aria-live="polite">{qty}</span>
          <button type="button" className={step} aria-label={t("More tickets")} disabled={qty >= maxQty} onClick={() => setValue("quantity", qty + 1)}><Plus className="size-4" /></button>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-fg/15 pt-5">
        <span className="text-fg/65">{t("Total")}</span>
        <span className="text-xl font-bold"><Price amount={event.price * qty} from={event.currency} /></span>
      </div>
    </>
  );

  const wrap = "glass rounded-4xl p-6 lg:sticky lg:top-24";

  if (availability !== "open") {
    return (
      <aside className={wrap}>
        {summary}
        <button type="button" disabled className={ctaClass}>{availability === "sold_out" ? t("Sold out") : t("This event has ended")}</button>
      </aside>
    );
  }

  if (status !== "authenticated") {
    return (
      <aside className={wrap}>
        {summary}
        {status === "loading" ? (
          <button type="button" disabled className={ctaClass}>{t("Book tickets")}</button>
        ) : (
          <Link href="/login" className={ctaClass}>{t("Log in to book")}</Link>
        )}
      </aside>
    );
  }

  return (
    <aside className={wrap}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {summary}

          <fieldset className="mt-6 space-y-3 border-t border-fg/15 pt-5">
            <legend className="mb-1 text-sm font-semibold">{t("Payment method")}</legend>
            {paymentMethods.length === 0 && <p className="text-sm text-fg/60">{t("No payment method is available right now.")}</p>}
            {paymentMethods.map((m) => (
              <FormRadio key={m.id} name="payment_method" value={m.code}>
                <span className="flex items-center gap-2 font-medium">
                  {m.logo_url && <Image src={m.logo_url} alt="" width={28} height={28} className="size-7 rounded-md object-contain" />}
                  {m.name}
                </span>
              </FormRadio>
            ))}
            <FormError name="payment_method" />
          </fieldset>

          <fieldset className="mt-6 space-y-4 border-t border-fg/15 pt-5">
            <legend className="mb-1 text-sm font-semibold">{t("Billing details")}</legend>
            <FormInput name="customer_name" label={t("Full name")} autoComplete="name" />
            <FormInput name="customer_email" label={t("Email address")} type="email" autoComplete="email" />
            <FormInput name="customer_phone_number" label={t("Phone number")} type="tel" autoComplete="tel" />
            <FormInput name="customer_address" label={t("Address")} autoComplete="street-address" />
            <div className="grid grid-cols-2 gap-3">
              <FormInput name="country" label={t("Country")} autoComplete="country-name" />
              <FormInput name="postcode" label={t("Postcode")} autoComplete="postal-code" />
            </div>
          </fieldset>

          <button type="submit" disabled={formState.isSubmitting || redirecting || paymentMethods.length === 0} className={cn(ctaClass)}>
            {redirecting ? t("Redirecting to payment…") : formState.isSubmitting ? t("Please wait…") : t("Book tickets")}
          </button>
        </form>
      </FormProvider>
    </aside>
  );
}
