"use client";

import { CalendarDays } from "lucide-react";
import { DataTable, type Column, type FilterConfig } from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { textOf } from "@/features/event-category/localized";
import { deleteEventAction } from "@/features/event/actions";
import type { EventItem } from "@/features/event/types";
import type { Language } from "@/features/language/types";
import type { Currency } from "@/features/currency/types";
import { EventDetails } from "@/components/dashboard/events/event-details";
import { EventForm, type CategoryOption } from "@/components/dashboard/events/event-form";
import { EventStatusBadge } from "@/components/dashboard/events/event-status-badge";
import { LocalTime } from "@/components/dashboard/events/local-time";
import { Price } from "@/components/shared/price";

const FILTERS: FilterConfig[] = [
  {
    key: "status",
    label: "All Status",
    options: [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "canceled", label: "Canceled" },
    ],
  },
];

type Props = {
  events: EventItem[];
  meta: PaginationMeta;
  lang: string;
  languages: Language[];
  categories: CategoryOption[];
  currencies: Currency[];
};

export function ManagerEventTable({ events, meta, lang, languages, categories, currencies }: Props) {
  const COLUMNS: Column<EventItem>[] = [
    {
      key: "image",
      header: "Image",
      cell: (e) =>
        e.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.thumbnail.url} alt="" className="size-10 rounded-lg border border-border object-cover" />
        ) : (
          "—"
        ),
    },
    {
      key: "title",
      header: "Event",
      cell: (e) => (
        <div className="min-w-0">
          <p className="max-w-56 truncate font-medium">{textOf(e.title, lang)}</p>
          <p className="max-w-56 truncate text-xs text-fg/55">{e.category ? textOf(e.category.name, lang) : "—"}</p>
        </div>
      ),
    },
    { key: "starts_at", header: "Starts", cell: (e) => <LocalTime iso={e.starts_at} /> },
{ key: "price", header: "Price", cell: (e) => <Price amount={e.price} from={e.currency} /> },
    { key: "tickets", header: "Tickets", cell: (e) => `${e.available_tickets}/${e.total_tickets}` },
    { key: "status", header: "Status", cell: (e) => <EventStatusBadge status={e.status} /> },
  ];

  return (
    <DataTable
      columns={COLUMNS}
      data={events}
      meta={meta}
      rowKey={(e) => e.id}
      filters={FILTERS}
      searchPlaceholder="Search your events"
      emptyState={{ icon: CalendarDays, title: "No events yet", description: "Create your first event. It will go live once an admin approves it." }}
      actions={{
        view: {
          dialog: {
            customWidth: "sm:max-w-2xl",
            title: (e) => textOf(e.title, lang),
            content: (e) => <EventDetails event={e} lang={lang} />,
          },
        },
        edit: {
          dialog: {
            customWidth: "sm:max-w-3xl",
            title: (e) => `Edit ${textOf(e.title, lang)}`,
            content: (e, close) => (
              <EventForm languages={languages} categories={categories} currencies={currencies} event={e} onSuccess={close} />
            ),
          },
        },
        delete: deleteEventAction,
      }}
    />
  );
}
