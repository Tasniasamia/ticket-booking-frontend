export const instant = false;
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { ContactTable } from "@/components/dashboard/admin/contact/contact-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getContactTableAction } from "@/features/contact/actions";
import { AutoRefresh } from "@/components/shared/auto-refresh";

export const metadata: Metadata = { title: "Contact messages" };

export default async function AdminContactsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = parseTableParams(await searchParams, ["status"], 10);
  const res = await getContactTableAction(params);
  return (
    <div>
      <AutoRefresh/>
      <PageHeader title="Contact messages" subtitle="Messages from the public form. Reply sends an email." />
      {res.success && res.contacts && res.meta ? (
        <ContactTable contacts={res.contacts} meta={res.meta} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load contacts" description={res.message} />
      )}
    </div>
  );
}
