import type { PaymentSummary } from "@/features/payment/types";
import { Price } from "@/components/shared/price";

type Props = { summary: PaymentSummary };

export function PaymentSummaryCards({ summary }: Props) {
  const items = [
    { label: "Paid", value: summary.paid, tone: "text-emerald-400" },
    { label: "Pending", value: summary.pending, tone: "text-amber-400" },
    { label: "Total", value: summary.total, tone: "text-fg" },
  ];

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-2xl border border-fg/15 bg-panel/50 px-5 py-4"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-fg/50">{it.label}</p>
          <p className={`mt-1 text-xl font-bold tabular-nums ${it.tone}`}>
            <Price amount={it.value} from={summary.currency} />
          </p>
        </div>
      ))}
    </div>
  );
}
