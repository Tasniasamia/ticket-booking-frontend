"use client";

import OtpInput from "react-otp-input";
import { get, useController, useFormContext } from "react-hook-form";
import { OTP_LENGTH } from "@/lib/constants";
import { FormField } from "./form-field";

type Props = {
  name?: string;
  label?: string;
  /** কয়টা ঘর হবে (default: OTP_LENGTH) */
  length?: number;
};

const boxClass =
  "h-12 w-full min-w-0 rounded-2xl border border-fg/15 bg-fg/5 text-center text-xl font-bold outline-none transition focus:border-coral aria-invalid:border-red-500 sm:h-14 sm:text-2xl";

/**
 * react-otp-input দিয়ে বানানো OTP field: প্রতি digit এর আলাদা ঘর।
 * শুধু digit নেয়, paste করলে নিজে থেকে ভাগ হয়ে যায়, আর ঘর ভরলে পরের ঘরে যায়।
 * Form এ value যায় একটা string হিসেবে, যেমন "123456"।
 */
export function FormOtp({ name = "otp", label = "Verification code", length = OTP_LENGTH }: Props) {
  const { control, formState: { errors } } = useFormContext();
  const { field: { value, onChange, onBlur } } = useController({ name, control, defaultValue: "" });
  const error = get(errors, name)?.message as string | undefined;

  return (
    <FormField label={label} htmlFor={name} error={error}>
      <OtpInput
        value={value ?? ""}
        onChange={(code) => onChange(code.replace(/\D/g, ""))}
        numInputs={length}
        inputType="tel"
        skipDefaultStyles
        containerStyle="flex gap-2 sm:gap-3"
        renderInput={({ onBlur: libBlur, ...props }, index) => (
          <input
            {...props}
            id={index === 0 ? name : undefined}
            className={boxClass}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            onBlur={(e) => { libBlur(e); onBlur(); }}
          />
        )}
      />
    </FormField>
  );
}
