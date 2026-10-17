"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormInput, FormPassword, SubmitButton } from "@/components/common/form";
import { loginAction } from "@/features/auth/actions";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { startOtpCooldown } from "@/features/auth/hooks/use-cooldown";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    const res = await loginAction(values);
    console.log("response of login ", res);

    if (res.success && !res.user?.is_verified) {
      startOtpCooldown(values.email, "register", 120, true);
      form.reset();
      router.push(res.redirectTo ?? "/");
      return;
    }
    else if (res.success && res.user?.is_verified) {
      toast.success(res.message ?? "Logged in successfully!");
      form.reset();
      router.push(res.redirectTo ?? "/");
      form.reset();
      return;
    }

    toast.error(res.message);
    
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
      if (v?.[0]) form.setError(k as keyof LoginInput, { message: v[0] });
    });
  };

  return (
    <div className="sm:max-w-xl max-w-full sm:mx-auto px-3 sm:my-[120px] my-[60px]">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5 border border-fg/20 rounded-lg sm:p-6 p-3">
          <div>
            <h1 className="sm:text-3xl text-2xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-fg/65 sm:text-base text-sm">Log in to manage your bookings.</p>
          </div>

          <FormInput name="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" />
          <FormPassword name="password" label="Password" autoComplete="current-password" placeholder="Your password" />
          <div className="-mt-2 text-right">
            <Link href="/forgot-password" className="text-sm font-semibold text-coral hover:underline">Forgot password?</Link>
          </div>

          <SubmitButton loadingText="Logging in...">Log in</SubmitButton>

          <p className="text-center text-sm text-fg/65">
            New here? <Link href="/register" className="font-semibold text-coral hover:underline">Create an account</Link>
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
