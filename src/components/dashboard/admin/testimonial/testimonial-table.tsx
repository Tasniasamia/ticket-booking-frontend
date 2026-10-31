"use client";
import dayjs from "dayjs";
import { Quote } from "lucide-react";
import { DataTable, type Column } from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import type { Testimonial } from "@/features/testimonial/types";
import { deleteTestimonialAction } from "@/features/testimonial/actions";
import { StatusBadge } from "@/components/common/badge/status-badge";
import { TestimonialForm } from "./testimonial-form";

const fmt = (iso: string) => (iso ? dayjs(iso).format("DD MMM YYYY") : "—");
const COLUMNS: Column<Testimonial>[] = [
  { key: "image", header: "Photo", cell: (t) => t.image_url ? <img src={t.image_url} alt={t.name} className="size-10 rounded-full object-cover" /> : "—" },
  { key: "name", header: "Name", cell: (t) => t.name },
  { key: "role", header: "Role", cell: (t) => t.role || "—" },
  { key: "text", header: "Text", cell: (t) => (t.text.length > 60 ? t.text.slice(0, 60) + "…" : t.text) },
  { key: "active", header: "Status", cell: (t) => <StatusBadge label={t.is_active ? "Active" : "Inactive"} tone={t.is_active ? "success" : "danger"} /> },
  { key: "created", header: "Created", cell: (t) => fmt(t.created_at) },
];

export function TestimonialTable({ testimonials, meta }: { testimonials: Testimonial[]; meta: PaginationMeta }) {
  return (
    <DataTable
      columns={COLUMNS} data={testimonials} meta={meta} rowKey={(t) => t.id}
      searchPlaceholder="Search testimonials"
      emptyState={{ icon: Quote, title: "No testimonials yet", description: "Add one for the home page." }}
      actions={{
        view: { dialog: { title: (t) => t.name, content: (t) => <p className="text-sm italic">&ldquo;{t.text}&rdquo;</p> } },
        edit: { dialog: { title: (t) => `Edit ${t.name}`, content: (t, close) => <TestimonialForm item={t} onSuccess={close} />, customWidth: "sm:max-w-lg" } },
        delete: deleteTestimonialAction,
      }}
    />
  );
}
