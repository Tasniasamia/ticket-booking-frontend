"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormInput, SubmitButton } from "@/components/common/form";
import { UserAvatar } from "@/components/shared/user-avatar";
// import { useUser } from "@/providers/user-provider";
import { updateProfileAction } from "@/features/user/actions";
// import type { Profile } from "@/features/user/profile";
import { profileSchema, type ProfileInput } from "@/features/user/schemas";
import { useUser } from "@/providers/user-provider";
import { Profile } from "@/features/user/type";

const card = "rounded-3xl border border-fg/15 bg-panel/60 p-6 sm:p-8";

export function ProfileView() {
  const router = useRouter();
  const { user, status } = useUser();
  const [editing, setEditing] = useState(false);

  // Token এর মেয়াদ শেষ হলে বা logout হলে
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (!user) return <ProfileSkeleton />;

  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <aside className={`${card} flex flex-col items-center text-center`}>
        <UserAvatar name={user.name} image={user.image} sizes="112px" className="size-28 text-5xl" />
        <h2 className="mt-5 max-w-full truncate text-xl font-bold">{user.name}</h2>
        <p className="mt-1 max-w-full truncate text-sm text-fg/65">{user.email}</p>
        <span className="mt-4 rounded-full bg-fg/10 px-3 py-1 text-xs font-semibold capitalize">{user.role}</span>
        {user.createdAt && <p className="mt-4 text-xs text-fg/50">Member since {memberSince(user.createdAt)}</p>}
      </aside>

      <section className={card}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Personal details</h2>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className="glass rounded-full px-5 py-2 text-sm font-semibold hover:bg-fg/20">
              Edit profile
            </button>
          )}
        </div>

        {editing ? <EditForm profile={user} onDone={() => setEditing(false)} /> : <Details profile={user} />}
      </section>
    </div>
  );
}

function Details({ profile }: { profile: Profile }) {
  const rows: { label: string; value: string; wide?: boolean }[] = [
    { label: "Name", value: profile.name },
    { label: "Email", value: profile.email },
    { label: "Phone", value: profile.phone },
    { label: "Country", value: profile.country },
    ...(profile.role === "manager" ? [{ label: "Designation", value: profile.designation }] : []),
    { label: "Address", value: profile.address, wide: true },
  ];

  return (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.label} className={r.wide ? "sm:col-span-2" : undefined}>
          <dt className="text-sm text-fg/55">{r.label}</dt>
          <dd className="mt-1 break-words font-medium">{r.value || <span className="font-normal text-fg/40">Not added yet</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

const FIELDS = ["name", "phone", "country", "designation", "address"] as const;

function EditForm({ profile, onDone }: { profile: Profile; onDone: () => void }) {
  const { setUser } = useUser();
  const isManager = profile.role === "manager";

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: profile.name,
      phone: profile.phone,
      country: profile.country,
      designation: profile.designation,
      address: profile.address,
    },
  });

  const onSubmit = async (values: ProfileInput) => {
    // শুধু যেগুলো বদলেছে সেগুলো পাঠাই (designation শুধু manager এর)
    const changed: Partial<ProfileInput> = {};
    for (const key of FIELDS) {
      if (key === "designation" && !isManager) continue;
      if (values[key] !== profile[key]) changed[key] = values[key];
    }
    if (Object.keys(changed).length === 0) {
      toast.info("Nothing to save, no details were changed.");
      onDone();
      return;
    }

    const res = await updateProfileAction(changed);

    if (res.success && res.user) {
      setUser(res.user);
      toast.success(res.message ?? "Profile updated.");
      onDone();
      return;
    }

    toast.error(res.message ?? "Could not update profile. Try again.");
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
      if (v?.[0]) form.setError(k as keyof ProfileInput, { message: v[0] });
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput name="name" label="Name" autoComplete="name" />
          <FormInput name="phone" label="Phone" type="tel" autoComplete="tel" placeholder="+8801XXXXXXXXX" />
          <FormInput name="country" label="Country" autoComplete="country-name" />
          {isManager && <FormInput name="designation" label="Designation" />}
          <div className="sm:col-span-2"><FormInput name="address" label="Address" autoComplete="street-address" /></div>
        </div>

        <div className="flex flex-wrap gap-3">
          <SubmitButton loadingText="Saving..." className="w-auto px-8">Save changes</SubmitButton>
          <button type="button" onClick={onDone} className="glass rounded-full px-8 py-3.5 font-semibold hover:bg-fg/20">Cancel</button>
        </div>
      </form>
    </FormProvider>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_1fr]" aria-busy="true" aria-label="Loading profile">
      <div className="h-80 animate-pulse rounded-3xl bg-fg/10" />
      <div className="h-80 animate-pulse rounded-3xl bg-fg/10" />
    </div>
  );
}

function memberSince(iso: string) {
  const d = new Date(iso.replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(d);
}
