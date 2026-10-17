"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { FormPassword, SubmitButton } from "@/components/common/form";
import { resetPasswordAction } from "@/features/auth/actions";
import { resetPasswordSchema, type ResetPasswordInput } from "@/features/auth/schemas";
import { clearOtpCooldown } from "@/features/auth/hooks/use-cooldown";

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? ""; // শুধু দেখানো আর timer মোছার জন্য
  const otp = params.get("otp") ?? ""; // verify page থেকে আসা OTP, reset request এ যায়

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { newPassword: "", confirmPassword: "", otp: otp },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    const res = await resetPasswordAction(values);

    if (res.success) {
      clearOtpCooldown(email, "reset_password");
      console.log("updated password message ",res?.message);
      toast.success(res.message ?? "Password updated. Please log in.");
      router.push(res.redirectTo ?? "/login");
      return;
    }
      console.log("updated password message ",res?.message);

    toast.error(res.message ?? "Could not update password. Please try again.");
    Object.entries(res.fieldErrors ?? {}).forEach(([key, errors]) => {
      if (errors?.[0]) form.setError(key as keyof ResetPasswordInput, { message: errors[0] });
    });
  };

  return (
    <div className="sm:max-w-xl max-w-full sm:mx-auto px-3 sm:my-[120px] my-[60px]">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5 border border-fg/20 rounded-lg sm:p-6 p-3">
          <div>
            <h1 className="sm:text-3xl text-2xl font-extrabold tracking-tight">Reset your password</h1>
            <p className="mt-2 text-fg/65 sm:text-base text-sm">
              Your code for <span className="font-semibold text-fg">{email}</span> is verified. Choose a new password.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormPassword name="newPassword" label="New password" autoComplete="new-password" placeholder="Min 8 characters" />
            <FormPassword name="confirmPassword" label="Confirm password" autoComplete="new-password" placeholder="Repeat password" matchWith="newPassword" />
          </div>

          <SubmitButton loadingText="Updating...">Update password</SubmitButton>
        </form>
      </FormProvider>
    </div>
  );
}
