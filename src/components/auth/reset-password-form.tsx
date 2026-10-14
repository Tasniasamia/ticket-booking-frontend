"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FormAlert,
  PasswordInput,
  inputClass,
} from "@/components/shared/form-controls";
import { OTP_LENGTH } from "@/lib/constants";
import { resetPasswordAction } from "@/features/auth/actions";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/schemas";
import { ResendOtpButton } from "./resend-otp-button";

export function ResetPasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const emailFromUrl = useSearchParams().get("email") ?? "";
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const email = useWatch({ control, name: "email" });

  const onSubmit = async (values: ResetPasswordInput) => {
    setServerError(undefined);
    const res = await resetPasswordAction(values);
    if (!res.success) {
      setServerError(res.message);
      Object.entries(res.fieldErrors ?? {}).forEach(
        ([k, v]) =>
          v?.[0] && setError(k as keyof ResetPasswordInput, { message: v[0] }),
      );
      return;
    }
    router.push(res.redirectTo ?? "/login");
  };

  return (
    <div className="sm:max-w-xl max-w-full sm:mx-auto px-3 sm:my-[120px] my-[60px]">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 border border-fg/20 rounded-lg sm:p-6 p-3">
        <div>
          <h1 className="sm:text-3xl text-2xl font-extrabold tracking-tight">
            Reset your password
          </h1>
          <p className="mt-2 text-fg/65 sm:text-base text-sm">
            Enter the code from your email and choose a new password.
          </p>
        </div>
        <FormAlert message={serverError} />

        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
        <Field
          label="Verification code"
          htmlFor="otp"
          error={errors.otp?.message}
        >
          <input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={OTP_LENGTH}
            placeholder="123456"
            className={`${inputClass} text-center text-2xl font-bold tracking-[0.5em]`}
            aria-invalid={!!errors.otp}
            {...register("otp", {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              },
            })}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="New password"
            htmlFor="newPassword"
            error={errors.newPassword?.message}
          >
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              placeholder="Min 8 characters"
              aria-invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
          </Field>
          <Field
            label="Confirm password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </Field>
        </div>

        <button
          disabled={isSubmitting}
          className="btn-grad w-full rounded-full py-3.5 font-semibold disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
        <ResendOtpButton email={email} reason="reset_password" />
        <p className="text-center text-sm text-fg/65">
          <Link
            href="/login"
            className="font-semibold text-coral hover:underline"
          >
            Back to log in
          </Link>
        </p>
      </form>
    </div>
  );
}
