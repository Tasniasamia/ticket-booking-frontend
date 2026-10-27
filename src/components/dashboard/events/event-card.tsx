"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Ticket } from "lucide-react";
import type { EventItem } from "@/features/event/types";
import { textOf } from "@/lib/localized";
import { Price } from "@/components/shared/price";
import { T } from "@/components/shared/t";
import { useT } from "@/providers/preferences-provider";
import { LocalTime } from "./local-time";

/** Home slider আর /events grid, দুই জায়গাতেই এই একই card। lang server থেকে আসে, তাই ভাষা বদলের ঝলক নেই। */
export function EventCard({ event, lang }: { event: EventItem; lang: string }) {
  const t = useT();
  const title = textOf(event.title, lang);
  const soldOut = event.available_tickets <= 0;

  return (
    <article className="glass group h-full rounded-4xl p-3">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-fg/5">
        {event.thumbnail && (
          <Image src={event.thumbnail.url} alt={title} fill sizes="(min-width:1280px) 24vw, (min-width:640px) 45vw, 80vw" className="object-cover transition duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent" />
        <div className="glass-img absolute left-3 top-3 rounded-2xl px-3 py-1.5 text-center leading-tight">
          <p className="text-lg font-extrabold"><LocalTime iso={event.starts_at} format="DD" /></p>
          <p className="text-xs text-fg/75"><LocalTime iso={event.starts_at} format="MMM" /></p>
        </div>
        <Price amount={event.price} from={event.currency} className="btn-grad absolute right-3 top-3 rounded-full px-3.5 py-1.5 text-sm font-bold" />
        {event.category && (
          <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium">{textOf(event.category.name, lang)}</span>
        )}
      </div>
      <div className="px-2 pb-2 pt-4">
        <h3 className="line-clamp-1 text-lg font-bold">{title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-fg/65">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">{textOf(event.location, lang)}</span>
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-xs text-fg/60">
            <Ticket className="size-3.5" />
            {soldOut ? t("Sold out") : t("{count} tickets left", { count: event.available_tickets })}
          </span>
          <Link href={`/events/${event.id}`} className="btn-grad rounded-full px-5 py-2 text-sm font-semibold">
            <T k="Book now" />
          </Link>
        </div>
      </div>
    </article>
  );
}
