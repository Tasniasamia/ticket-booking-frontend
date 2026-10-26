import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { PageSettingsEditor } from "@/components/dashboard/admin/settings/page-settings-editor";
import { getLanguagesAction } from "@/features/language/actions";
import { getAllPageContentsAction } from "@/features/settings/actions";

export const metadata: Metadata = { title: "Page settings" };

async function PageSettingsContent() {
  const [pagesRes, langRes] = await Promise.all([getAllPageContentsAction(), getLanguagesAction()]);
  const languages = (langRes.languages ?? []).map((l) => ({ code: l.code, name: l.name }));
  return (
    <>
      {!pagesRes.success && <p className="mb-4 text-sm text-red-500">{pagesRes.message ?? "Could not load some pages."}</p>}
      <PageSettingsEditor pages={pagesRes.pages} languages={languages} />
    </>
  );
}

export default function PageSettingsPage() {
  return (
    <div>
      <PageHeader title="Page settings" subtitle="Edit the titles, subtitles and images of the public pages, in every language." />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <PageSettingsContent />
      </Suspense>
    </div>
  );
}
