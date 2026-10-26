"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormInput, FormTextarea, SubmitButton } from "@/components/common/form";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { findMediaIdByUrlAction, saveSiteSettingsAction } from "@/features/settings/actions";
import { siteSettingsSchema, type SiteSettingsInput } from "@/features/settings/schemas";
import type { SiteSettings } from "@/features/settings/types";
import { FormFieldList } from "@/components/common/form/form-field-list";

const card = "space-y-4 rounded-3xl border border-fg/15 bg-panel/40 p-5 sm:p-6";
// Logo ও "banner" model নামে upload হয় (backend এর media allowed list এ আছে)
const LOGO_MODEL = "banner";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [logoId, setLogoId] = useState<number | null>(null);

  const form = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    mode: "onChange",
    defaultValues: {
      site_name: settings.site_name,
      site_email: settings.site_email,
      site_phone: settings.site_phone,
      site_logo: settings.site_logo,
      site_address: settings.site_address,
      site_description: settings.site_description,
      site_footer: settings.site_footer,
      client_side_url: settings.client_side_url,
      server_side_url: settings.server_side_url,
      social_media_link: settings.social_media_link,
    },
  });

  // Settings এ শুধু logo URL থাকে, তাই "remove" এর জন্য URL থেকে media id খুঁজে নিই
  useEffect(() => {
    if (!settings.site_logo) return;
    let alive = true;
    findMediaIdByUrlAction(settings.site_logo, LOGO_MODEL).then((id) => alive && setLogoId(id));
    return () => {
      alive = false;
    };
  }, [settings.site_logo]);

  const onSubmit = async (values: SiteSettingsInput) => {
    try {
      const res = await saveSiteSettingsAction(values);
      if (res.success) {
        toast.success(res.message ?? "Saved.");
        router.refresh();
        return;
      }
      toast.error(res.message ?? "Could not save.");
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
        if (v?.[0]) form.setError(k as FieldPath<SiteSettingsInput>, { message: v[0] });
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
        <section className={card}>
          <h2 className="text-lg font-bold">General</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput name="site_name" label="Site name" placeholder="TicketBooking" />
            <FormInput name="site_email" label="Email" type="email" placeholder="support@ticketbooking.com" />
            <FormInput name="site_phone" label="Phone" placeholder="+880 1700 000000" />
            <FormInput name="site_address" label="Address" placeholder="Khulna, Bangladesh" />
          </div>
          <FormTextarea name="site_description" label="Description (shown in the footer)" rows={3} />
          <FormInput name="site_footer" label="Footer text" placeholder="© TicketBooking. All rights reserved." />

          <FormImageUploader
            name="site_logo"
            label="Logo"
            modelName={LOGO_MODEL}
            mediaId={logoId}
            defaultPreviewUrl={form.watch("site_logo") || null}
            aspect="1/1"
            size="sm"
            onUploadSuccess={(media) => {
              form.setValue("site_logo", media.public_url, { shouldDirty: true, shouldValidate: true });
              setLogoId(media.id);
            }}
            onUploadError={(message: string) => toast.error(message || "Failed to upload image.")}
            onRemove={() => {
              form.setValue("site_logo", "", { shouldDirty: true });
              setLogoId(null);
              toast.info("Logo removed. Press Save to apply.");
            }}
          />
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">URLs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput name="client_side_url" label="Client side URL" placeholder="https://ticketbooking.com" />
            <FormInput name="server_side_url" label="Server side URL" placeholder="https://api.ticketbooking.com" />
          </div>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold">Social media</h2>
          <p className="text-sm text-fg/60">Shown as icons in the footer. Use names like Facebook, Instagram, X, YouTube, LinkedIn.</p>
          <FormFieldList
            name="social_media_link"
            label="Links"
            columns={[
              { name: "name", placeholder: "Facebook" },
              { name: "link", placeholder: "https://facebook.com/yourpage" },
            ]}
            addLabel="+ Add Social Link"
          />
        </section>

        <SubmitButton loadingText="Saving..." className="sm:w-auto sm:px-12">Save settings</SubmitButton>
      </form>
    </FormProvider>
  );
}
