"use client";

import { get, useFormContext, type RegisterOptions } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";
import { inputClass } from "./styles";

type Props = Omit<React.ComponentProps<"input">, "name" | "id"> & {
  name: string;
  label: string;
  /** RHF এর extra register option (দরকার হলে) */
  options?: RegisterOptions;
  /**
   * true হলে label + visible input লুকায়, কিন্তু field form-এ register থাকে।
   * type="hidden" দিলেও same behavior।
   * userId, eventId ইত্যাদি ID field-এর জন্য use করো।
   */
  hidden?: boolean;
};

/**
 * Text, email, number সব input এর জন্য একটাই component।
 * type="text"   → string নেয়
 * type="number" → number নেয় (খালি থাকলে undefined)
 * hidden / type="hidden" → UI লুকায়, value form-এ থাকে
 */
export function FormInput({
  name,
  label,
  type = "text",
  options,
  className,
  hidden,
  ...rest
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name)?.message as string | undefined;

  const registerOpts = {
    ...(type === "number" && {
      setValueAs: (v: string) =>
        v === "" || v == null ? undefined : Number(v),
    }),
    ...options,
  };

  // Hidden: label দেখাবে না, শুধু form-এ value রাখবে
  if (hidden || type === "hidden") {
    return (
      <input
        id={name}
        type="hidden"
        {...rest}
        {...register(name, registerOpts)}
      />
    );
  }

  return (
    <FormField label={label} htmlFor={name} error={error}>
      <input
        id={name}
        type={type}
        className={cn(inputClass, className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
        {...register(name, registerOpts)}
      />
    </FormField>
  );
}