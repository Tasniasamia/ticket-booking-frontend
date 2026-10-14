"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { CalendarCheck, Ticket } from "lucide-react";
import { Field, FormAlert, PasswordInput, inputClass } from "@/components/shared/form-controls";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import { registerAction } from "@/features/auth/actions";

const ROLES = [
  { value: "user", title: "User", text: "Browse events and book tickets", icon: Ticket },
  { value: "manager", title: "Manager", text: "Create and manage events", icon: CalendarCheck },
] as const;


export function RegisterForm() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [serverError, setServerError] = useState<string>();

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "user", terms: false, captcha: "" },
  });

  const onSubmit = async (values: RegisterInput) => {
    setServerError(undefined);
    const res = await registerAction(values);
    if (!res.success) {
      setServerError(res.message);
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => v?.[0] && setError(k as keyof RegisterInput, { message: v[0] }));
      // setValue("captcha", "");
      return;
    }
    router.push(res.redirectTo ?? "/login");
  };

  const err = (name: keyof RegisterInput) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
        <div className="sm:max-w-xl  max-w-full  sm:mx-auto px-3 sm:my-[120px] my-[60px]">

    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 border border-fg/20 rounded-lg sm:p-6 p-3">
      <div>
        <h1 className="sm:text-3xl text-2xl font-extrabold tracking-tight">Create your account</h1>
        <p className="mt-2 text-fg/65 sm:text-base text-sm">Join to book events or start hosting your own.</p>
      </div>

      <FormAlert message={serverError} />

      <Field label="Full name" htmlFor="name" error={errors.name?.message}>
        <input id="name" autoComplete="name" placeholder="Your name" className={inputClass} {...err("name")} {...register("name")} />
      </Field>

      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputClass} {...err("email")} {...register("email")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="new-password" placeholder="Min 8 characters" {...err("password")} {...register("password")} />
        </Field>
        <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <PasswordInput id="confirmPassword" autoComplete="new-password" placeholder="Repeat password" {...err("confirmPassword")} {...register("confirmPassword")} />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">I want to join as</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {ROLES.map(({ value, title, text, icon: Icon }) => (
            <label key={value} className="cursor-pointer">
              <input type="radio" value={value} className="peer sr-only" {...register("role")} />
              <span className="glass flex h-full items-start gap-3 rounded-2xl p-4 transition peer-checked:border-[#c936b4] peer-checked:ring-2 peer-checked:ring-[#c936b4] peer-focus-visible:outline-2 peer-focus-visible:outline-[#c936b4]">
                <span className="btn-grad grid size-10 shrink-0 place-items-center rounded-xl"><Icon className="size-5" /></span>
                <span><span className="block font-semibold">{title}</span><span className="text-sm text-fg/65">{text}</span></span>
              </span>
            </label>
          ))}
        </div>
        {errors.role && <p role="alert" className="mt-1.5 text-sm text-red-500">{errors.role.message}</p>}
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-magenta" {...err("terms")} {...register("terms")} />
          <span>
            I agree to the <Link href="/terms" className="font-semibold text-coral hover:underline">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="font-semibold text-coral hover:underline">Privacy Policy</Link>.
          </span>
        </label>
        {errors.terms && <p id="terms-error" role="alert" className="mt-1.5 text-sm text-red-500">{errors.terms.message}</p>}
      </div>

      {/* <div>
        {SITE_KEY ? (
          resolvedTheme && (
            <ReCAPTCHA
              key={`${resolvedTheme}-${captchaKey}`}
              sitekey={SITE_KEY}
              theme={resolvedTheme === "dark" ? "dark" : "light"}
              onChange={(t) => setValue("captcha", t ?? "", { shouldValidate: true })}
              onExpired={() => setValue("captcha", "", { shouldValidate: true })}
            />
          )
        ) : (
          <FormAlert message="reCAPTCHA site key missing. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to .env.local and restart the dev server." />
        )}
        {errors.captcha && <p role="alert" className="mt-1.5 text-sm text-red-500">{errors.captcha.message}</p>}
      </div> */}

      <button disabled={isSubmitting} className="btn-grad w-full rounded-full py-3.5 font-semibold disabled:opacity-60">
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-fg/65">
        Already have an account? <Link href="/login" className="font-semibold text-coral hover:underline">Log in</Link>
      </p>
    </form>
    </div>
  );
}
