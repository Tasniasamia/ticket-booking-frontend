import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { ContactTable } from "@/components/dashboard/admin/contact/contact-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getContactTableAction } from "@/features/contact/actions";
import { AutoRefresh } from "@/components/shared/auto-refresh";

export const metadata: Metadata = { title: "Contact messages" };

async function ContactsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["status"], 10);
  const res = await getContactTableAction(params);

  if (res.success && res.contacts && res.meta) {
    return <ContactTable contacts={res.contacts} meta={res.meta} />;
  }
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Could not load contacts"
      description={res.message}
    />
  );
}

export default function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div>
      <AutoRefresh />
      <PageHeader
        title="Contact messages"
        subtitle="Messages from the public form. Reply sends an email."
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <ContactsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
