"use client";

import dayjs from "dayjs";
import { CreditCard } from "lucide-react";
import { DataTable, type Column, type FilterConfig } from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { StatusBadge } from "@/components/common/badge/status-badge";
import { deletePaymentMethodAction } from "@/features/payment-method/actions";
import type { PaymentMethod } from "@/features/payment-method/types";
import { PaymentMethodForm } from "./payment-method-form";

const FILTERS: FilterConfig[] = [
  { key: "enable", label: "All Status", options: [{ value: "true", label: "Enabled" }, { value: "false", label: "Disabled" }] },
];

// Secret মান পুরো দেখাই না: শুরুর ৪ অক্ষর + ••••। পুরোটা Edit এ আছে।
const mask = (v: string) => (v.length <= 4 ? "••••" : `${v.slice(0, 4)}••••`);

const COLUMNS: Column<PaymentMethod>[] = [
  {
    key: "logo",
    header: "Logo",
    cell: (m) =>
      m.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.logo_url} alt={m.name} className="size-10 rounded-lg border border-border bg-white object-contain p-1" />
      ) : (
        "—"
      ),
  },
  { key: "name", header: "Name" },
  { key: "code", header: "Gateway", cell: (m) => <span className="font-mono text-xs">{m.code}</span> },
  { key: "credentials", header: "Credentials", cell: (m) => `${Object.keys(m.credentials).length} keys` },
  { key: "enable", header: "Status", cell: (m) => <StatusBadge label={m.enable ? "enabled" : "disabled"} tone={m.enable ? "success" : "danger"} /> },
  { key: "created_at", header: "Created", cell: (m) => dayjs(m.created_at).format("MMM D, YYYY") },
];

export function PaymentMethodTable({ paymentMethods, meta }: { paymentMethods: PaymentMethod[]; meta: PaginationMeta }) {
  return (
    <DataTable
      columns={COLUMNS}
      data={paymentMethods}
      meta={meta}
      rowKey={(m) => m.id}
      filters={FILTERS}
      searchPlaceholder="Search by name or gateway"
      emptyState={{ icon: CreditCard, title: "No payment methods yet", description: "Add a payment method and it will show up here." }}
      actions={{
        view: {
          dialog: {
            title: (m) => m.name,
            content: (m) => (
              <div className="space-y-3 text-sm ">
                {m.logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.logo_url} alt={m.name} className="size-20 rounded-xl border border-border bg-white object-contain p-2" />
                )}
                <p>Gateway: {m.code}</p>
                <p>Status: {m.enable ? "Enabled" : "Disabled"}</p>
                <div>
                  <p className="mb-1 font-semibold">Credentials</p>
                  <ul className="space-y-1 rounded-2xl bg-fg/5 p-3 font-mono text-xs">
                    {Object.entries(m.credentials).map(([k, v]) => (
                      <li key={k} className="flex justify-between gap-4"><span>{k}</span><span className="truncate text-fg/60">{mask(v)}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            ),
          },
        },
        edit: {
          dialog: {
            title: (m) => `Edit ${m.name}`,
            content: (m, close) => <PaymentMethodForm paymentMethod={m} onSuccess={close} />,
          },
        },
        delete: deletePaymentMethodAction,
      }}
    />
  );
}
