"use client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Profile } from "@/features/user/type";
import { updateMemberAction } from "@/features/user/actions";
import { ProfileInputAdmin, profileSchemaAdmin } from "@/features/user/schemas";
import { SubmitButton } from "@/components/common/form";

const field =
  "w-full rounded-xl border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-coral";

export function MemberEditForm({ user, onSuccess }: { user: Profile; onSuccess?: () => void }) {
  const router = useRouter();

  const form = useForm<ProfileInputAdmin>({
    resolver: zodResolver(profileSchemaAdmin),
    mode: "onChange",
    defaultValues: {
      status: user.status === "deactivated" ? "deactivated" : "active",
      role: user.role,
      designation: user.designation ?? "",
      is_verified: user.is_verified ?? false,
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const onSubmit = form.handleSubmit(
    async (values) => {
      const res = await updateMemberAction(user.id, {
        name: user.name,
        email: user.email,
        role: values.role,
        status: values.status,
        is_verified: values.is_verified,
        designation: values.designation,
      });

      if (res.success) {
        toast.success(res.message ?? "Updated.");
        onSuccess?.();
        router.refresh();
        return;
      }
      toast.error(res.message ?? "Failed.");
    },
    // validation fail hole chup na thake error dekhabe
    (errs) => {
      const first = Object.values(errs)[0];
      toast.error(first?.message?.toString() ?? "Please check the form.");
    },
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-fg/55">Name</label>
          <input className={field} value={user.name} disabled readOnly />
        </div>
        <div>
          <label className="mb-1 block text-xs text-fg/55">Email</label>
          <input className={field} value={user.email} disabled readOnly />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-fg/55">Role</label>
            <select className={field} {...register("role")}>
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-fg/55">Status</label>
            <select className={field} {...register("status")}>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-fg/55">Designation</label>
          <input className={field} {...register("designation")} />
          {errors.designation && (
            <p className="mt-1 text-xs text-red-500">{errors.designation.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("is_verified")} /> Verified
        </label>

        <SubmitButton loadingText="Saving...">Save changes</SubmitButton>
      </form>
    </FormProvider>
  );
}