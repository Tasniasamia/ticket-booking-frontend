"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FormAlert, inputClass } from "@/components/shared/form-controls";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/schemas";
import { forgotPasswordAction } from "@/features/auth/actions";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setServerError(undefined);
    const res = await forgotPasswordAction(values);
    if (!res.success) {
      setServerError(res.message);
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => v?.[0] && setError(k as keyof ForgotPasswordInput, { message: v[0] }));
      return;
    }
    router.push(res.redirectTo ?? "/reset-password");
  };

  return (
        <div className="sm:max-w-xl  max-w-full sm:mx-auto px-3 sm:my-[120px] my-[60px]">

    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Forgot password?</h1>
        <p className="mt-2 text-fg/65">Enter your email and we will send you a code to reset it.</p>
      </div>
      <FormAlert message={serverError} />
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} aria-invalid={!!errors.email} {...register("email")} />
      </Field>
      <button disabled={isSubmitting} className="btn-grad w-full rounded-full py-3.5 font-semibold disabled:opacity-60">
        {isSubmitting ? "Sending..." : "Send code"}
      </button>
      <p className="text-center text-sm text-fg/65"><Link href="/login" className="font-semibold text-coral hover:underline">Back to log in</Link></p>
    </form>
    </div>
  );
}
