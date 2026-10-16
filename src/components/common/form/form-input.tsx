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
};

/**
 * Text, email, number সব input এর জন্য একটাই component।
 * type="text"   → string নেয়
 * type="number" → number নেয় (খালি থাকলে undefined)
 */
export function FormInput({ name, label, type = "text", options, className, ...rest }: Props) {
  const { register, formState: { errors } } = useFormContext();
  const error = get(errors, name)?.message as string | undefined;

  return (
    <FormField label={label} htmlFor={name} error={error}>
      <input
        id={name}
        type={type}
        className={cn(inputClass, className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
        {...register(name, {
          ...(type === "number" && { setValueAs: (v: string) => (v === "" || v == null ? undefined : Number(v)) }),
          ...options,
        })}
      />
    </FormField>
  );
}
