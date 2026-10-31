"use client";
import dayjs from "dayjs";
import { HelpCircle } from "lucide-react";
import { DataTable, type Column } from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import type { FAQ } from "@/features/faq/types";
import { deleteFAQAction } from "@/features/faq/actions";
import { StatusBadge } from "@/components/common/badge/status-badge";
import { FAQForm } from "./faq-form";

const fmt = (iso: string) => (iso ? dayjs(iso).format("DD MMM YYYY") : "—");
const COLUMNS: Column<FAQ>[] = [
  { key: "question", header: "Question", cell: (f) => f.question || "—" },
  { key: "answer", header: "Answer", cell: (f) => (f.answer.length > 80 ? f.answer.slice(0, 80) + "…" : f.answer) },
  { key: "sort", header: "Order", cell: (f) => f.sort_order },
  { key: "active", header: "Status", cell: (f) => <StatusBadge label={f.is_active ? "Active" : "Inactive"} tone={f.is_active ? "success" : "danger"} /> },
  { key: "created", header: "Created", cell: (f) => fmt(f.created_at) },
];

export function FAQTable({ faqs, meta }: { faqs: FAQ[]; meta: PaginationMeta }) {
  return (
    <DataTable
      columns={COLUMNS}
      data={faqs}
      meta={meta}
      rowKey={(f) => f.id}
      searchPlaceholder="Search FAQs"
      emptyState={{ icon: HelpCircle, title: "No FAQs yet", description: "Add an FAQ and it will show up here." }}
      actions={{
        view: { dialog: { title: (f) => f.question, content: (f) => <div className="space-y-2 text-sm"><p className="whitespace-pre-wrap">{f.answer}</p></div> } },
        edit: { dialog: { title: () => "Edit FAQ", content: (f, close) => <FAQForm faq={f} onSuccess={close} />, customWidth: "sm:max-w-lg" } },
        delete: deleteFAQAction,
      }}
    />
  );
}
