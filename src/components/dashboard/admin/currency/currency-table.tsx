"use client";
import { Wallet } from "lucide-react";
import {
  DataTable,
  type Column,
  type FilterConfig,
} from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { StatusBadge } from "@/components/common/badge/status-badge";
import { deleteCurrencyAction } from "@/features/currency/actions";
import type { Currency } from "@/features/currency/types";
import { CurrencyForm } from "./currency-form";
import { useRouter } from "next/navigation";

const FILTERS: FilterConfig[] = [
  {
    key: "is_default",
    label: "All currencies",
    options: [
      { value: "true", label: "Default only" },
      { value: "false", label: "Not default" },
    ],
  },
];

const COLUMNS: Column<Currency>[] = [
  { key: "code", header: "Code" },
  { key: "name", header: "Name" },
  { key: "symbol", header: "Symbol" },
  {
    key: "rate",
    header: "Rate to BDT",
    cell: (c) => `1 ${c.code} = ৳${c.rateToBDT}`,
  },
  {
    key: "default",
    header: "Default",
    cell: (c) =>
      c.isDefault ? <StatusBadge label="Default" tone="warning" /> : "—",
  },
  {
    key: "status",
    header: "Status",
    cell: (c) => (
      <StatusBadge
        label={c.status}
        tone={c.status === "enable" ? "success" : "danger"}
      />
    ),
  },
];

/** Function (column, action) Server Component থেকে পাঠানো যায় না, তাই এই client wrapper। */
export function CurrencyTable({
  currencies,
  meta,
}: {
  currencies: Currency[];
  meta: PaginationMeta;
}) {
  // const router = useRouter();
  return (
    <DataTable
      columns={COLUMNS}
      data={currencies}
      meta={meta}
      rowKey={(c) => c.id}
      filters={FILTERS}
      searchPlaceholder="Search by code or name"
      emptyState={{
        icon: Wallet,
        title: "No currencies yet",
        description: "Add a currency and it will show up here.",
      }}
      actions={{
        // dialog: content এ আপনার form বসবে। close() দিলে dialog বন্ধ হয়ে table refresh হয়।
        view: {
          dialog: {
            title: (c) => `${c.name} (${c.code})`,
            content: (c) => (
              <div>
                <p className="text-sm">Symbol: {c.symbol}</p>
                <p className="text-sm">Rate to BDT: ৳{c.rateToBDT}</p>
                <p className="text-sm">Status: {c.status}</p>
              </div>
            ),
          },
        },
        // অন্য page এ নিতে চাইলে href; dialog চাইলে উপরের মতো dialog: {...}
        edit: {
          dialog: {
            title: (c) => `${c.name} (${c.code})`,
            content: (c, close) => (
              <CurrencyForm currency={c} onSuccess={close} />
            ),
            customWidth: "sm:max-w-md",
          },
        },
        delete: deleteCurrencyAction,
      }}
    />
  );
}
