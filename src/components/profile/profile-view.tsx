"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormInput, SubmitButton } from "@/components/common/form";
import { updateProfileAction } from "@/features/user/actions";
import { profileSchema, type ProfileInput } from "@/features/user/schemas";
import { useUser } from "@/providers/user-provider";
import type { Profile } from "@/features/user/type";
import { FormImageUploader } from "../common/form/form-image-uploader";
import { ProfileSkeleton } from "../skeleton/profileSkeleton";
import { StatusBadge } from "../common/badge/status-badge";


export function ProfileView() {
  const router = useRouter();
  const { user, status } = useUser();
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div >
  
     {/* <Sidebar user={user} /> */}
      {/* <section > */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="md:text-3xl text-xl font-bold">Personal details</h2>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="cursor-pointer glass rounded-full px-5 py-2 text-sm font-semibold hover:bg-fg/20"
            >
              Edit profile
            </button>
          )}
        </div>

        {editing ? (
          <EditForm
            key={user.id}
            profile={user}
            onDone={() => setEditing(false)}
          />
        ) : (
          <Details profile={user} />
        )}
      {/* </section> */}
    </div>
  );
}

type Row = {
  label: string;
  value: string | null | undefined;
  wide?: boolean;
  render?: (value: string) => React.ReactNode; // value থাকলে কীভাবে দেখাবে
};

function Details({ profile }: { profile: Profile }) {
  const rows: Row[] = [
     {
      label: "Profile Image",
      value: profile.profile_image,
      wide: true,
      render: (value) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Profile"
          className="size-28 rounded-xl border border-border object-cover"
        />
      ),
    },
    { label: "Name", value: profile.name },
    { label: "Email", value: profile.email },
    { label: "Phone", value: profile.phone_number },
    { label: "Country", value: profile.country },
    
    ...(profile.role === "manager"
      ? [{ label: "Designation", value: profile.designation }]
      : []),

    { label: "Address", value: profile.address},
   {
  label: "Verification Status",
  value: profile.is_verified ? "Verified" : "Not verified",
  
  render: (value) => (
    <StatusBadge
      label={value}
      tone={profile.is_verified  ? "success" : "warning"}
    />
  ),
},
{
  label: "Account Status",
  value: profile.status,
  render: (value) => (
    <StatusBadge
      label={value}
      tone={value.toLowerCase() === "active" ? "success" : "danger"}
    />
  ),
},
  ];

  return (
    <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className={row.wide ? "sm:col-span-2" : undefined}>
          <dt className="text-sm text-fg/55">{row.label}</dt>

          <dd className="mt-1 break-words font-medium">
            {row.value ? (
              row.render ? row.render(row.value) : row.value
            ) : (
              <span className="font-normal text-fg/40">Not added yet</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}


function EditForm({
  profile,
  onDone,
}: {
  profile: Profile;
  onDone: () => void;
}) {
  const { setUser } = useUser();
  const isManager = profile.role === "manager";
  const [profileImageURL, setProfileImageURL] = useState<string | null>(
    profile.profile_image,
  );

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: profile.name ?? "",
      phone_number: profile.phone_number ?? "",
      country: profile.country ?? "",
      designation: profile.designation ?? "",
      address: profile.address ?? "",
      profile_image_id: profile.profile_image_id ?? null,
      profile_image: profile.profile_image ?? null,
    },
  });

  const onSubmit = async (values: ProfileInput) => {
    console.log("submitted values:", values);

    // designation শুধু manager এর, অন্যদের পাঠিও না
    const payload: Partial<ProfileInput> = { ...values };
    if (!isManager) delete payload.designation;

    try {
      const res = await updateProfileAction(payload);
      console.log("after sending profile upadate request ", res);
      console.log("res of update profile", res);

      if (res.success && res.user) {
        setUser(res.user);
        toast.success(res.message ?? "Profile updated.");
        onDone();
        return;
      }

      toast.error(res.message ?? "Could not update profile. Try again.");

      Object.entries(res.fieldErrors ?? {}).forEach(([key, errors]) => {
        if (errors?.[0]) {
          form.setError(key as keyof ProfileInput, { message: errors[0] });
        }
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <FormProvider {...form}>
    <form
  onSubmit={form.handleSubmit(onSubmit, (errors) => {
    console.log("validation errors:", errors);
    toast.error("Please fix the form errors.");
  })}
  noValidate
  className="space-y-5"
>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput name="name" label="Name" autoComplete="name" />

          <FormInput
            name="phone_number"
            label="Phone"
            type="tel"
            autoComplete="tel"
            placeholder="+8801XXXXXXXXX"
          />

          <FormInput
            name="country"
            label="Country"
            autoComplete="country-name"
          />

          {isManager && <FormInput name="designation" label="Designation" />}

          <div className="sm:col-span-2">
            <FormInput
              name="address"
              label="Address"
              autoComplete="street-address"
            />
          </div>

          <div className="sm:col-span-2">
            <FormImageUploader
              name="profile_image" //backend
              label="Profile Image"//frontend
              modelName="user"  //backend
              modelId={profile.id} //backend
              mediaId={form.watch("profile_image_id")}//backend
              defaultPreviewUrl={profileImageURL || null} //backend
              aspect="1/1"
              size="md"
              onUploadSuccess={(media) => {  //main work after upload into media
                form.setValue("profile_image_id", media.id, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                form.setValue("profile_image", media.public_url, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                setProfileImageURL(media.public_url);
                form.clearErrors(["profile_image", "profile_image_id"]);
              }}
              onUploadError={(message: string) => {  //get error upload time
                toast.error(message || "Failed to upload profile image.");
              }}
              onRemove={() => {  //main work after remove image
                form.setValue("profile_image_id", null, { shouldDirty: true });
                form.setValue("profile_image", null, { shouldDirty: true });
                setProfileImageURL(null);
                form.clearErrors(["profile_image", "profile_image_id"]);
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <SubmitButton loadingText="Saving..." className="w-auto px-8">
            Save changes
          </SubmitButton>

          <button
            type="button"
            onClick={onDone}
            className="cursor-pointer glass rounded-full px-8 py-3.5 font-semibold hover:bg-fg/20"
          >
            Cancel
          </button>
        </div>
      </form>
    </FormProvider>
  );
}




