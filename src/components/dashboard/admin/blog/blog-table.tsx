"use client";

import { FileText } from "lucide-react";
import {
  DataTable,
  type Column,
  type FilterConfig,
} from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { LocalTime } from "@/components/dashboard/events/local-time";
import { textOf } from "@/lib/localized";
import { deleteBlogAction } from "@/features/blog/actions";
import type { BlogItem } from "@/features/blog/types";
import { BlogStatusSelect } from "./blog-status-select";
import { BlogForm } from "./blog-form";
import type { Language } from "@/features/language/types";

const FILTERS: FilterConfig[] = [
  {
    key: "status",
    label: "All statuses",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "canceled", label: "Canceled" },
    ],
  },
];

type Props = {
  blogs: BlogItem[];
  meta: PaginationMeta;
  lang: string;
  languages: Language[];
};

export function BlogTable({ blogs, meta, lang, languages }: Props) {
  const columns: Column<BlogItem>[] = [
    {
      key: "title",
      header: "Title",
      cell: (b) => (
        <div className="min-w-0 max-w-64">
          <p className="truncate font-medium">{textOf(b.title, lang)}</p>
          <p className="truncate text-xs text-fg/50">/{b.slug || b.id}</p>
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      cell: (b) => b.author?.name ?? "—",
    },
    {
      key: "stats",
      header: "Engagement",
      cell: (b) => (
        <span className="text-xs text-fg/70">
          {b.like_count} likes · {b.comment_count} comments
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (b) => <BlogStatusSelect blogId={b.id} status={b.status} />,
    },
    {
      key: "created",
      header: "Created",
      cell: (b) => <LocalTime iso={b.created_at} format="DD MMM YYYY" />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={blogs}
      meta={meta}
      rowKey={(b) => b.id}
      filters={FILTERS}
      searchPlaceholder="Search by title..."
      emptyState={{
        icon: FileText,
        title: "No blog posts yet",
        description: "Create a post to share news and updates.",
      }}
      actions={{
        view: {
          href: (b) => `/admin/blog/${b.id}`,
        },
        edit: {
          dialog: {
            customWidth: "sm:max-w-3xl",
            title: (b) => `Edit: ${textOf(b.title, lang)}`,
            content: (b, close) => (
              <BlogForm languages={languages} blog={b} onSuccess={close} />
            ),
          },
        },
        delete: deleteBlogAction,
      }}
    />
  );
}
