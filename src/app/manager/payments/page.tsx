import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { PaymentTable } from "@/components/dashboard/payments/payment-table";
import { PaymentSummaryCards } from "@/components/dashboard/payments/payment-summary-cards";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { getManagerPaymentsAction } from "@/features/payment/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";

export const metadata: Metadata = { title: "Event Payments" };

export default async function ManagerPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["status"]);
  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const res = await getManagerPaymentsAction(params, lang);

  if (!res.success || !res.payments || !res.meta) {
    return (
      <EmptyState icon={AlertTriangle} title="Could not load payments" description={res.message} />
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Payments for your events</h2>
      {res.summary && <PaymentSummaryCards summary={res.summary} />}
      <PaymentTable payments={res.payments} meta={res.meta} lang={lang} showUser showEvent />
    </div>
  );
}
