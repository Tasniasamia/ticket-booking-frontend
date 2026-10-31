"use client";
import dayjs from "dayjs";
import { Mail } from "lucide-react";
import { DataTable, type Column } from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import type { Subscriber } from "@/features/subscribe/types";
import { StatusBadge } from "@/components/common/badge/status-badge";

const fmt = (iso: string) => (iso ? dayjs(iso).format("DD MMM YYYY") : "—");
const COLUMNS: Column<Subscriber>[] = [
  { key: "email", header: "Email", cell: (s) => s.email },
  { key: "active", header: "Status", cell: (s) => <StatusBadge label={s.is_active ? "Active" : "Inactive"} tone={s.is_active ? "success" : "danger"} /> },
  { key: "created", header: "Subscribed", cell: (s) => fmt(s.created_at) },
];

export function SubscriberTable({ subscribers, meta }: { subscribers: Subscriber[]; meta: PaginationMeta }) {
  return (
    <DataTable
      columns={COLUMNS} data={subscribers} meta={meta} rowKey={(s) => s.id}
      searchPlaceholder="Search by email"
      emptyState={{ icon: Mail, title: "No subscribers yet", description: "Footer newsletter signups appear here." }}
    />
  );
}
