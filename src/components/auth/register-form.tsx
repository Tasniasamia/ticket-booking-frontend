"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormCheckbox, FormInput, FormPassword, FormRadio, SubmitButton } from "@/components/common/form";
import { registerAction } from "@/features/auth/actions";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import { startOtpCooldown } from "@/features/auth/hooks/use-cooldown";
import { CalendarCheck, Ticket } from "lucide-react";
const ROLES = [
  { value: "user", title: "User", text: "Browse events and book tickets", icon: Ticket },
  { value: "manager", title: "Manager", text: "Create and manage events", icon: CalendarCheck },
] as const;

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "user", terms: false },
  });

  const onSubmit = async (values: RegisterInput) => {
    const res = await registerAction(values);
    if (res.success) {
      toast.success(res.message ?? "Account created! Please verify your email.");
      startOtpCooldown(values.email, "register");
      form.reset();
      router.push(res.redirectTo ?? "/verify-otp");
      return;
    }
    toast.error(res.message ?? "Registration failed. Please try again.");
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
      if (v?.[0]) form.setError(k as keyof RegisterInput, { message: v[0] });
    });
  };

  return (
    <div className="sm:max-w-xl max-w-full sm:mx-auto px-3 sm:my-[120px] my-[60px]">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5 border border-fg/20 rounded-lg sm:p-6 p-3">
          <div>
            <h1 className="sm:text-3xl text-2xl font-extrabold tracking-tight">Create your account</h1>
            <p className="mt-2 text-fg/65 sm:text-base text-sm">Join to book events or start hosting your own.</p>
          </div>

          <FormInput name="name" label="Full name" autoComplete="name" placeholder="Your name" />
          <FormInput name="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormPassword name="password" label="Password" autoComplete="new-password" placeholder="Min 8 characters" />
            <FormPassword name="confirmPassword" label="Confirm password" autoComplete="new-password" placeholder="Repeat password" matchWith="password" />
          </div>

           <fieldset>
        <legend className="mb-2 text-sm font-semibold">I want to join as</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {ROLES.map(({ value, title, text, icon: Icon }) => (
            <label key={value} className="cursor-pointer">
              <input type="radio" value={value} className="peer sr-only" {...form.register("role")} />
              <span className="glass flex h-full items-start gap-3 rounded-2xl p-4 transition peer-checked:border-[#c936b4] peer-checked:ring-2 peer-checked:ring-[#c936b4] peer-focus-visible:outline-2 peer-focus-visible:outline-[#c936b4]">
                <span className="btn-grad grid size-10 shrink-0 place-items-center rounded-xl"><Icon className="size-5" /></span>
                <span><span className="block font-semibold">{title}</span><span className="text-sm text-fg/65">{text}</span></span>
              </span>
            </label>
          ))}
        </div>
        {form.formState.errors.role && <p role="alert" className="mt-1.5 text-sm text-red-500">{form.formState.errors.role.message}</p>}
      </fieldset>

          <FormCheckbox name="terms">
            I agree to the <Link href="/terms" className="font-semibold text-coral hover:underline">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="font-semibold text-coral hover:underline">Privacy Policy</Link>.
          </FormCheckbox>

          <SubmitButton loadingText="Creating account...">Create account</SubmitButton>

          <p className="text-center text-sm text-fg/65">
            Already have an account? <Link href="/login" className="font-semibold text-coral hover:underline">Log in</Link>
          </p>
        </form>
      </FormProvider>
    </div>
  );
}
