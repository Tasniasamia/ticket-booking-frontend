"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormInput, SubmitButton } from "@/components/common/form";
import { forgotPasswordAction } from "@/features/auth/actions";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/schemas";

export function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    const res = await forgotPasswordAction(values);
    if (res.success) {
      toast.success(res.message ?? "We sent a code to your email.");
      router.push(res.redirectTo ?? "/reset-password");
      return;
    }
    toast.error(res.message ?? "Something went wrong. Please try again.");
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
      if (v?.[0]) form.setError(k as keyof ForgotPasswordInput, { message: v[0] });
    });
  };

  return (
    <div className="sm:max-w-xl max-w-full sm:mx-auto px-3 sm:my-[120px] my-[60px]">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5 border border-fg/20 rounded-lg sm:p-6 p-3">
          <div>
            <h1 className="sm:text-3xl text-2xl font-extrabold tracking-tight">Forgot password?</h1>
            <p className="mt-2 text-fg/65 sm:text-base text-sm">Enter your email and we will send you a code to reset it.</p>
          </div>

          <FormInput name="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" />

          <SubmitButton loadingText="Sending...">Send code</SubmitButton>

          <p className="text-center text-sm text-fg/65">
            <Link href="/login" className="font-semibold text-coral hover:underline">Back to log in</Link>
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
