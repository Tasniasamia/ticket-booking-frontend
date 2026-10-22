"use client";

import { get, useFormContext, type RegisterOptions } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";
import { inputClass } from "./styles";

type Props = Omit<React.ComponentProps<"textarea">, "name" | "id"> & {
  name: string;
  label: string;
  options?: RegisterOptions;
};

/** FormInput এর মতোই, তবে বহু লাইনের লেখার জন্য। */
export function FormTextarea({ name, label, options, className, rows = 3, ...rest }: Props) {
  const { register, formState: { errors } } = useFormContext();
  const error = get(errors, name)?.message as string | undefined;

  return (
    <FormField label={label} htmlFor={name} error={error}>
      <textarea
        id={name}
        rows={rows}
        className={cn(inputClass, "resize-y", className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
        {...register(name, options)}
      />
    </FormField>
  );
}
