"use client";

import { Ticket } from "lucide-react";
import {
  DataTable,
  type Column,
  type FilterConfig,
} from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { StatusBadge } from "@/components/common/badge/status-badge";
import { LocalTime } from "@/components/dashboard/events/local-time";
import { textOf } from "@/lib/localized";
import type { BookingItem, BookingStatus } from "@/features/booking/types";
import { Price } from "@/components/shared/price";

const STATUS_TONE: Record<BookingStatus, "success" | "warning" | "danger" | "neutral"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "danger",
};

const FILTERS: FilterConfig[] = [
  {
    key: "status",
    label: "All statuses",
    options: [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
];

type Props = {
  bookings: BookingItem[];
  meta: PaginationMeta;
  lang?: string;
  /** Admin sees customer column */
  showUser?: boolean;
  /** Show event title */
  showEvent?: boolean;
  /** Enable status filter (admin list is paginated server-side) */
  enableFilters?: boolean;
};

export function BookingTable({
  bookings,
  meta,
  lang = "en",
  showUser = true,
  showEvent = true,
  enableFilters = true,
}: Props) {
  const columns: Column<BookingItem>[] = [
    {
      key: "code",
      header: "Booking",
      cell: (b) => (
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold">{b.bookingCode || `#${b.id}`}</p>
          {/* <p className="text-xs text-fg/50">ID {b.id}</p> */}
        </div>
      ),
    },
  ];

  if (showEvent) {
    columns.push({
      key: "event",
      header: "Event",
      cell: (b) =>
        b.event ? (
          <div className="min-w-0 max-w-52">
            <p className="truncate font-medium">{textOf(b.event.title, lang)}</p>
            {b.event.startsAt && (
              <p className="text-xs text-fg/55">
                <LocalTime iso={b.event.startsAt} format="DD MMM YYYY" />
              </p>
            )}
          </div>
        ) : (
          "—"
        ),
    });
  }

  if (showUser) {
    columns.push({
      key: "user",
      header: "Customer",
      cell: (b) =>
        b.user ? (
          <div className="min-w-0 max-w-44">
            <p className="truncate font-medium">{b.user.name}</p>
            <p className="truncate text-xs text-fg/55">{b.user.email}</p>
          </div>
        ) : (
          "—"
        ),
    });
  }

  columns.push(
    {
      key: "qty",
      header: "Qty",
      cell: (b) => <span className="tabular-nums">{b.quantity}</span>,
    },
    {
      key: "price",
      header: "Total",
      cell: (b) => (
        <Price amount={b.totalPrice} from={b.event?.currency ?? "BDT"} />
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (b) => (
        <StatusBadge label={b.status} tone={STATUS_TONE[b.status] ?? "neutral"} />
      ),
    },
    {
      key: "created",
      header: "Booked on",
      cell: (b) => <LocalTime iso={b.createdAt} format="DD MMM YYYY, hh:mm A" />,
    },
  );

  return (
    <DataTable
      columns={columns}
      data={bookings}
      meta={meta}
      rowKey={(b) => b.id}
      filters={enableFilters ? FILTERS : []}
      searchPlaceholder="Search by booking code..."
      emptyState={{
        icon: Ticket,
        title: "No bookings yet",
        description: "When tickets are booked they will appear here.",
      }}
    />
  );
}
