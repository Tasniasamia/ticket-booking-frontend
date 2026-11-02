"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { FormPassword, SubmitButton } from "@/components/common/form";
import { updatePasswordAction } from "@/features/user/actions";
import { updatePasswordSchema, type UpdatePasswordInput } from "@/features/user/schemas";

const EMPTY: UpdatePasswordInput = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function UpdatePasswordForm() {
  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onChange",
    defaultValues: EMPTY,
  });

  const onSubmit = async (values: UpdatePasswordInput) => {
    const res = await updatePasswordAction(values);

    if (res.success) {
      toast.success(res.message ?? "Password updated.");
      form.reset(EMPTY);
      return;
    }

    toast.error(res.message ?? "Could not update password. Please try again.");
    Object.entries(res.fieldErrors ?? {}).forEach(([key, errors]) => {
      if (errors?.[0]) form.setError(key as keyof UpdatePasswordInput, { message: errors[0] });
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className=" mx-auto space-y-5">
        <div>
          <h2 className="md:text-3xl text-xl font-bold">Update password</h2>
          <p className="mt-2 text-sm text-fg/65 sm:text-base">
            Enter your current password, then choose a new one.
          </p>
        </div>

        <FormPassword name="currentPassword" label="Current password" autoComplete="current-password" placeholder="Your current password" />

        <div className="grid gap-5 sm:grid-cols-1">
          <FormPassword name="newPassword" label="New password" autoComplete="new-password" placeholder="Min 8 characters" />
          <FormPassword name="confirmPassword" label="Confirm password" autoComplete="new-password" placeholder="Repeat password" matchWith="newPassword" />
        </div>

        <SubmitButton loadingText="Updating...">Update password</SubmitButton>
      </form>
    </FormProvider>
  );
}