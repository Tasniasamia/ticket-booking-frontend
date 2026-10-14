"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput  } from "@/features/auth/schemas";
import { loginAction } from "@/features/auth/actions";
import { Field, FormAlert, PasswordInput, inputClass } from "../shared/form-controls";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setServerError(undefined);
    const res = await loginAction(values);
    if (!res.success) {
      setServerError(res.message);
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => v?.[0] && setError(k as keyof LoginInput, { message: v[0] }));
      return;
    }
    router.push(res.redirectTo ?? "/");
    router.refresh();
  };

  return (
    <div className="sm:max-w-xl  max-w-full sm:mx-auto px-3 sm:my-[120px] my-[60px]">
    <form className="space-y-5 border border-fg/20 rounded-lg sm:p-6 p-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <h1 className="sm:text-3xl text-2xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-fg/65 sm:text-base text-sm">Log in to manage your bookings.</p>
      </div>

      <FormAlert message={serverError} />

      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputClass}
          aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
      </Field>

      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <PasswordInput id="password" autoComplete="current-password" placeholder="Your password"
          aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} {...register("password")} />
      </Field>
      <div className="-mt-2 text-right">
        <Link href="/forgot-password" className="text-sm font-semibold text-coral hover:underline">Forgot password?</Link>
      </div>

      <button disabled={isSubmitting} className="btn-grad w-full rounded-full py-3.5 font-semibold disabled:opacity-60">
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>

      <p className="text-center text-sm text-fg/65">
        New here? <Link href="/register" className="font-semibold text-coral hover:underline">Create an account</Link>
      </p>
    </form>
    </div>
  );
}
