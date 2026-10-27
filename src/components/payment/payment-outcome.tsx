import { PaymentStatusCard, type PaymentVariant } from "@/components/payment/payment-status-card";
import { verifyPaymentAction } from "@/features/payment/actions";
import type { PaymentState } from "@/features/payment/types";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";

export type PaymentSearchParams = Promise<Record<string, string | string[] | undefined>>;
type Expect = "success" | "failed" | "cancelled";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const STATUS = { success: "SUCCESS", failed: "FAILED", cancelled: "CANCELLED" } as const;
const FROM_STATE: Record<PaymentState, PaymentVariant> = { success: "success", pending: "pending", failed: "failed", cancelled: "cancelled" };

/**
 * তিনটা result page এর শেষ ধাপ: URL এর session_id / tran_id দিয়ে backend কে জিজ্ঞেস করে আসল অবস্থা দেখায়।
 * URL এ "success" লেখা থাকলেই success দেখাই না, backend যা বলে সেটাই (pending হলে "Confirming…")।
 */
export async function PaymentOutcome({ searchParams, expect }: { searchParams: PaymentSearchParams; expect: Expect }) {
  const [sp, langRes, saved] = await Promise.all([searchParams, getLanguagesAction(), getLanguageCookie()]);
  const lang = pickLanguage(langRes.languages ?? [], saved);

  const sessionId = first(sp.session_id);
  const tranId = first(sp.tran_id);

  // Stripe এর cancel URL এ কিছু থাকে না: backend ডাকার কিছু নেই, শুধু message
  if (expect !== "success" && !sessionId && !tranId) {
    return <PaymentStatusCard variant={expect} lang={lang} />;
  }

  const res = await verifyPaymentAction({ sessionId, tranId, status: STATUS[expect] });
  if (!res.success || !res.payment) {
    return <PaymentStatusCard variant={expect === "success" ? "error" : expect} message={res.message} lang={lang} />;
  }
  return <PaymentStatusCard variant={FROM_STATE[res.payment.state]} payment={res.payment} lang={lang} />;
}
