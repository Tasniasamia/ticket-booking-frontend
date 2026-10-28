"use client";

import { Wallet } from "lucide-react";
import {
  DataTable,
  type Column,
  type FilterConfig,
} from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { StatusBadge } from "@/components/common/badge/status-badge";
import { LocalTime } from "@/components/dashboard/events/local-time";
import { textOf } from "@/lib/localized";
import type { PaymentItem, PaymentStatus } from "@/features/payment/types";
import { Price } from "@/components/shared/price";

const STATUS_TONE: Record<PaymentStatus, "success" | "warning" | "danger" | "neutral"> = {
  success: "success",
  pending: "warning",
  failed: "danger",
  cancelled: "neutral",
};

const FILTERS: FilterConfig[] = [
  {
    key: "status",
    label: "All statuses",
    options: [
      { value: "pending", label: "Pending" },
      { value: "success", label: "Success" },
      { value: "failed", label: "Failed" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
];

type Props = {
  payments: PaymentItem[];
  meta: PaginationMeta;
  lang?: string;
  showUser?: boolean;
  showEvent?: boolean;
};

export function PaymentTable({
  payments,
  meta,
  lang = "en",
  showUser = true,
  showEvent = true,
}: Props) {
  const columns: Column<PaymentItem>[] = [
    {
      key: "txn",
      header: "Transaction",
      cell: (p) => (
        <div className="min-w-0">
          <p className="truncate font-mono text-xs font-semibold">{p.transactionId || `P-${p.id}`}</p>
          <p className="text-xs text-fg/50">{p.bookingCode || "—"}</p>
        </div>
      ),
    },
  ];

  if (showEvent) {
    columns.push({
      key: "event",
      header: "Event",
      cell: (p) =>
        p.event ? (
          <p className="max-w-48 truncate font-medium">{textOf(p.event.title, lang)}</p>
        ) : (
          "—"
        ),
    });
  }

  if (showUser) {
    columns.push({
      key: "user",
      header: "Customer",
      cell: (p) =>
        p.user ? (
          <div className="min-w-0 max-w-40">
            <p className="truncate font-medium">{p.user.name}</p>
            <p className="truncate text-xs text-fg/55">{p.user.email}</p>
          </div>
        ) : (
          "—"
        ),
    });
  }

  columns.push(
    {
      key: "method",
      header: "Method",
      cell: (p) => <span className="capitalize">{p.paymentMethod || "—"}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      cell: (p) => <Price amount={p.amount} from={p.currency} />,
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => (
        <StatusBadge label={p.status} tone={STATUS_TONE[p.status] ?? "neutral"} />
      ),
    },
    {
      key: "paid",
      header: "Paid at",
      cell: (p) =>
        p.paidAt ? (
          <LocalTime iso={p.paidAt} format="DD MMM YYYY, hh:mm A" />
        ) : (
          <span className="text-fg/40">—</span>
        ),
    },
    {
      key: "created",
      header: "Created",
      cell: (p) => <LocalTime iso={p.createdAt} format="DD MMM YYYY" />,
    },
  );

  return (
    <DataTable
      columns={columns}
      data={payments}
      meta={meta}
      rowKey={(p) => p.id}
      filters={FILTERS}
      searchPlaceholder="Search by transaction or booking code..."
      emptyState={{
        icon: Wallet,
        title: "No payments yet",
        description: "Successful and pending payments will show up here.",
      }}
    />
  );
}
