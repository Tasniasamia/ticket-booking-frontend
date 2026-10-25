import { StatusBadge } from "@/components/common/badge/status-badge";
import type { EventStatus } from "@/features/event/types";

const TONE = { pending: "warning", approved: "success", canceled: "danger" } as const;

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return <StatusBadge label={status} tone={TONE[status]} />;
}
