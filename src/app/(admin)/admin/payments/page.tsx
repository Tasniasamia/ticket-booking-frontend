export const instant = false
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { PaymentTable } from "@/components/dashboard/payments/payment-table";
import { PaymentSummaryCards } from "@/components/dashboard/payments/payment-summary-cards";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getAdminPaymentsAction } from "@/features/payment/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";

export const metadata: Metadata = { title: "Payments" };

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["status"]);
  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const res = await getAdminPaymentsAction(params, lang);

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="All payments with paid dates, methods and status."
      />
      {res.success && res.payments && res.meta ? (
        <>
          {res.summary && <PaymentSummaryCards summary={res.summary} />}
          <PaymentTable
            payments={res.payments}
            meta={res.meta}
            lang={lang}
            showUser
            showEvent
          />
        </>
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load payments" description={res.message} />
      )}
    </div>
  );
}
