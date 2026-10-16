"use client";

import { useEffect } from "react";
import { get, useFormContext, useWatch } from "react-hook-form";
import { FormField } from "./form-field";
import { PasswordInput } from "./password-input";

type Props = Omit<React.ComponentProps<"input">, "name" | "id" | "type"> & {
  name: string;
  label: string;
  /**
   * এটা দিলে এই field টা "confirm password" হিসেবে কাজ করে।
   * যে field এর সাথে মেলাতে হবে তার name দিন, যেমন matchWith="password"।
   * ওই field বদলালেও এই field আবার check হয় (confirm এ কিছু লেখা থাকলে)।
   * Error message আসে zod schema এর .refine() থেকে।
   */
  matchWith?: string;
};

export function FormPassword({ name, label, matchWith, ...rest }: Props) {
  const { register, control, trigger, getValues, formState: { errors } } = useFormContext();
  const error = get(errors, name)?.message as string | undefined;

  // যে field এর সাথে মেলাতে হবে সেটা বদলালে এই field আবার validate করো
  const target = useWatch({ control, name: matchWith ?? name });
  useEffect(() => {
    if (matchWith && getValues(name)) trigger(name);
  }, [target, matchWith, name, getValues, trigger]);

  return (
    <FormField label={label} htmlFor={name} error={error}>
      <PasswordInput
        id={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
        {...register(name)}
      />
    </FormField>
  );
}
