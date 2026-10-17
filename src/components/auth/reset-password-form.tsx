"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormOtp, FormPassword, SubmitButton } from "@/components/common/form";
import { resetPasswordAction } from "@/features/auth/actions";
import { resetPasswordSchema, type ResetPasswordInput } from "@/features/auth/schemas";
import { clearOtpCooldown } from "@/features/auth/hooks/use-cooldown";
import { ResendOtpButton } from "./resend-otp-button";

export function ResetPasswordForm() {
  const router = useRouter();
  const emailFromUrl = useSearchParams().get("email") ?? "";
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { email: emailFromUrl, otp: "", newPassword: "", confirmPassword: "" },
  });
  const email = emailFromUrl; // proxy guarantee করে URL এ valid email আছে

  const onSubmit = async (values: ResetPasswordInput) => {
    const res = await resetPasswordAction(values);
    if (res.success) {
      clearOtpCooldown(values.email, "reset_password");
      toast.success(res.message ?? "Password updated. Please log in.");
      router.push(res.redirectTo ?? "/login");
      return;
    }
    toast.error(res.message ?? "Could not update password. Please try again.");
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
      if (v?.[0]) form.setError(k as keyof ResetPasswordInput, { message: v[0] });
    });
  };

  return (
    <div className="sm:max-w-xl max-w-full sm:mx-auto px-3 sm:my-[120px] my-[60px]">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5 border border-fg/20 rounded-lg sm:p-6 p-3">
          <div>
            <h1 className="sm:text-3xl text-2xl font-extrabold tracking-tight">Reset your password</h1>
            <p className="mt-2 text-fg/65 sm:text-base text-sm">Enter the code we sent to <span className="font-semibold text-fg">{email}</span> and choose a new password.</p>
          </div>

          <FormOtp />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormPassword name="newPassword" label="New password" autoComplete="new-password" placeholder="Min 8 characters" />
            <FormPassword name="confirmPassword" label="Confirm password" autoComplete="new-password" placeholder="Repeat password" matchWith="newPassword" />
          </div>

          <SubmitButton loadingText="Updating...">Update password</SubmitButton>
          <ResendOtpButton email={email} reason="reset_password" />

          <p className="text-center text-sm text-fg/65">
            <Link href="/login" className="font-semibold text-coral hover:underline">Back to log in</Link>
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
