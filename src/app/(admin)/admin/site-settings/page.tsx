import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { SiteSettingsForm } from "@/components/dashboard/admin/settings/site-settings-form";
import { getSiteSettingsAdminAction } from "@/features/settings/actions";

export const metadata: Metadata = { title: "Site settings" };

async function SiteSettingsContent() {
  const res = await getSiteSettingsAdminAction();
  if (!res.success || !res.settings) return <p className="text-sm text-red-500">{res.message ?? "Could not load site settings."}</p>;
  return <SiteSettingsForm settings={res.settings} />;
}

export default function SiteSettingsPage() {
  return (
    <div>
      <PageHeader title="Site settings" subtitle="Name, logo, contact details and social links used across the whole site." />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <SiteSettingsContent />
      </Suspense>
    </div>
  );
}
