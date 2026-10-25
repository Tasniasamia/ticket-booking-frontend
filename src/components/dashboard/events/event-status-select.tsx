"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { tableTheme } from "@/components/common/table/table-theme";
import { updateEventStatusAction } from "@/features/event/actions";
import { EVENT_STATUSES, type EventStatus } from "@/features/event/types";

/** Admin এর জন্য: table এর ভেতরেই status বদলানো যায় (pending → approved / canceled)। */
export function EventStatusSelect({ eventId, status }: { eventId: number; status: EventStatus }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const change = (next: EventStatus) => {
    if (next === status) return;
    start(async () => {
      const res = await updateEventStatusAction(eventId, next);
      if (!res.success) {
        toast.error(res.message ?? "Could not update status.");
        return;
      }
      toast.success(res.message ?? "Status updated.");
      router.refresh();
    });
  };

  return (
    <select
      aria-label="Event status"
      value={status}
      disabled={pending}
      onChange={(e) => change(e.target.value as EventStatus)}
      className={cn(tableTheme.control, "h-9 cursor-pointer px-3 capitalize disabled:cursor-wait disabled:opacity-60")}
    >
      {EVENT_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-panel capitalize">
          {s}
        </option>
      ))}
    </select>
  );
}
