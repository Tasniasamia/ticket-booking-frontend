"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormOtp, SubmitButton } from "@/components/common/form";
import { OTP_LENGTH } from "@/lib/constants";
import { verifyOtpAction } from "@/features/auth/actions";
import { verifyOtpSchema, type VerifyOtpInput } from "@/features/auth/schemas";
import { clearOtpCooldown } from "@/features/auth/hooks/use-cooldown";
import type { OtpReason } from "@/features/auth/service";
import { ResendOtpButton } from "./resend-otp-button";

export function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? ""; // proxy guarantee করে URL এ valid email আছে
  // reason এখানে শুধু resend button আর timer এর জন্য। আসল সিদ্ধান্ত server action cookie দেখে নেয়।
  const reason: OtpReason = params.get("reason") === "reset_password" ? "reset_password" : "register";

  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    mode: "onChange",
    defaultValues: { email, otp: "" },
  });

  const onSubmit = async (values: VerifyOtpInput) => {
    const res = await verifyOtpAction(values);
    console.log("res?.message ", res?.message);
    if (res.success) {
      clearOtpCooldown(values.email, reason);
      toast.success(res.message ?? "Verified.");
      // signup হলে /login, forgot-password হলে /reset-password। server ই redirectTo ঠিক করে দেয়
      router.push(res.redirectTo ?? "/login");
      return;
    }
    toast.error(res.message ?? "Verification failed. Please try again.");
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
      if (v?.[0]) form.setError(k as keyof VerifyOtpInput, { message: v[0] });
    });
  };

  return (
    <div className="sm:max-w-md max-w-full sm:mx-auto px-3 sm:my-[120px] my-[60px]">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5 border border-fg/20 rounded-lg sm:p-6 p-3">
          <div>
            <h1 className="sm:text-3xl text-2xl font-extrabold tracking-tight">Verify your OTP</h1>
            <p className="mt-2 text-fg/65 sm:text-base text-sm">
              Enter the {OTP_LENGTH}-digit code we sent to <span className="font-semibold text-fg">{email}</span>.
            </p>
          </div>

          <FormOtp />

          <SubmitButton loadingText="Verifying...">Verify OTP</SubmitButton>
          <ResendOtpButton email={email} reason={reason} />

          <p className="text-center text-sm text-fg/65">
            <Link href="/login" className="font-semibold text-coral hover:underline">Back to log in</Link>
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
