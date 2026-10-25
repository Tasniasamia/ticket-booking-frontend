"use client";

import dayjs from "dayjs";
import { Tags } from "lucide-react";
import { DataTable, type Column } from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import type { EventCategoryListItem } from "@/features/event-category/types";
import type { Language } from "@/features/language/types";
import { deleteEventCategoryAction } from "@/features/event-category/actions";
import { EditEventCategory } from "./edit-event-category";

const fmt = (iso: string) => (iso ? dayjs(iso).format("DD MMM YYYY, hh:mm A") : "—");

const COLUMNS: Column<EventCategoryListItem>[] = [
  {
    key: "image",
    header: "Image",
    cell: (c) =>
      c.event_category_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.event_category_image_url}
          alt={c.name}
          className="size-10 rounded-lg border border-border object-cover"
        />
      ) : (
        "—"
      ),
  },
  { key: "name", header: "Name", cell: (c) => c.name || "—" },
  { key: "description", header: "Description", cell: (c) => c.description || "—" },
  { key: "created_at", header: "Created", cell: (c) => fmt(c.created_at) },
];

type Props = {
  eventCategories: EventCategoryListItem[];
  meta: PaginationMeta;
  languages: Language[];
};

/** Function (column, action) Server Component থেকে পাঠানো যায় না, তাই এই client wrapper। */
export function EventCategoryTable({ eventCategories, meta, languages }: Props) {
  return (
    <DataTable
      columns={COLUMNS}
      data={eventCategories}
      meta={meta}
      rowKey={(c) => c.id}
      searchPlaceholder="Search by name"
      emptyState={{
        icon: Tags,
        title: "No event categories yet",
        description: "Add an event category and it will show up here.",
      }}
      actions={{
        view: {
          dialog: {
            title: (c) => c.name,
            content: (c) => (
              <div className="space-y-2">
                {c.event_category_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.event_category_image_url}
                    alt={c.name}
                    className="size-28 rounded-xl border border-border object-cover"
                  />
                )}
                <p className="text-sm">Name: {c.name || "—"}</p>
                <p className="text-sm">Description: {c.description || "—"}</p>
              </div>
            ),
          },
        },
        edit: {
          dialog: {
            title: (c) => `Edit ${c.name}`,
            content: (c, close) => (
              <EditEventCategory id={c.id} languages={languages} onSuccess={close} />
            ),
                        customWidth: "sm:max-w-2xl",

          },
        },
        delete: deleteEventCategoryAction,
      }}
    />
  );
}