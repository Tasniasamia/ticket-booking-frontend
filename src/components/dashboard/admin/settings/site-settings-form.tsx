"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FormInput, FormTextarea, SubmitButton } from "@/components/common/form";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { findMediaIdByUrlAction, saveSiteSettingsAction } from "@/features/settings/actions";
import { siteSettingsFormSchema, type SiteSettingsFormValues } from "@/features/settings/schemas";
import type { SiteSettings } from "@/features/settings/types";
import { FormFieldList } from "@/components/common/form/form-field-list";
import { deleteMediaAction } from "@/features/media/actions";
import { isPendingImage, revokePendingImages, toImageItem, withUploadSession, type ImageItem } from "@/features/media/deferred";

const card = "space-y-4 rounded-3xl border border-fg/15 bg-panel/40 p-5 sm:p-6";
// Logo ও "banner" model নামে upload হয় (backend এর media allowed list এ আছে)
const LOGO_MODEL = "banner";

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsFormSchema),
    mode: "onChange",
    defaultValues: {
      site_name: settings.site_name,
      site_email: settings.site_email,
      site_phone: settings.site_phone,
      // Settings এ শুধু logo URL থাকে (id নেই), তাই id 0। পুরনো logo মোছার সময় URL থেকে id খুঁজি।
      site_logo: toImageItem(settings.site_logo, 0),
      site_address: settings.site_address,
      site_description: settings.site_description,
      site_footer: settings.site_footer,
      client_side_url: settings.client_side_url,
      server_side_url: settings.server_side_url,
      social_media_link: settings.social_media_link,
    },
  });

  // Form বন্ধ হলে upload না হওয়া logo এর blob preview মুক্ত করো
  useEffect(() => () => revokePendingImages([form.getValues("site_logo")]), [form]);

  const onSubmit = async (values: SiteSettingsFormValues) => {
    const { site_logo: logo } = values;
    // Save এর সময় আগের logo বদলালে (নতুন ছবি) বা সরালে (null) পুরনোটা server থেকে মুছতে হবে
    const logoChanged = !!settings.site_logo && (logo === null || isPendingImage(logo));

    try {
      // ১) logo upload (select করলে শুধু preview ছিল) ২) settings save। Save fail করলে upload হওয়া logo মুছে যায়।
      let savedLogo: ImageItem | null = null;
      const res = await withUploadSession({ modelName: LOGO_MODEL }, async (session) => {
        const [uploaded] = logo ? await session.resolveMany([logo]) : [null];
        savedLogo = uploaded ?? null;
        return saveSiteSettingsAction({ ...values, site_logo: uploaded?.url ?? "" });
      });

      if (res.success) {
        // ৩) পুরনো logo এর media id URL দিয়ে খুঁজে মুছো (best effort, save এর result বদলায় না)
        if (logoChanged) {
          const oldId = await findMediaIdByUrlAction(settings.site_logo, LOGO_MODEL);
          if (oldId) await deleteMediaAction(oldId);
        }
        // Form এই page এ থেকে যায়, তাই pending file সরিয়ে server এর logo বসাই (নইলে পরের Save এ আবার upload হত)
        revokePendingImages([logo]);
        form.reset({ ...values, site_logo: savedLogo });
        toast.success(res.message ?? "Saved.");
        router.refresh();
        return;
      }
      toast.error(res.message ?? "Could not save.");
      Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) => {
        if (v?.[0]) form.setError(k as FieldPath<SiteSettingsFormValues>, { message: v[0] });
      });
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
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

          {/* deferred: logo select করলে শুধু preview, upload হবে "Save settings" এ */}
          <FormImageUploader name="site_logo" label="Logo" deferred aspect="1/1" size="sm" />
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
