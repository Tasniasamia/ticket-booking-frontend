import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { MANAGERS, type EventItem } from "@/lib/mock-data";

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="glass group h-full rounded-4xl p-3">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
        <Image src={event.image} alt={event.title} fill sizes="(min-width:1280px) 24vw, (min-width:640px) 45vw, 80vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/60 to-transparent" />
        <div className="glass-img absolute left-3 top-3 rounded-2xl px-3 py-1.5 text-center leading-tight">
          <p className="text-lg font-extrabold">{event.day}</p>
          <p className="text-xs text-fg/75">{event.month}</p>
        </div>
        <span className="btn-grad absolute right-3 top-3 rounded-full px-3.5 py-1.5 text-sm font-bold">${event.price}</span>
        <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-medium">{event.category}</span>
      </div>
      <div className="px-2 pb-2 pt-4">
        <h3 className="line-clamp-1 text-lg font-bold">{event.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-fg/65"><MapPin className="size-4 shrink-0" /><span className="truncate">{event.location}</span></p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ul className="flex -space-x-2.5">
              {MANAGERS.slice(0, 3).map((m) => (
                <li key={m.id} className="relative size-7 overflow-hidden rounded-full ring-2 ring-panel"><Image src={m.image} alt="" fill sizes="28px" className="object-cover" /></li>
              ))}
            </ul>
            <span className="flex items-center gap-1 text-xs text-fg/60"><Users className="size-3.5" />{event.going.toLocaleString("en-US")}</span>
          </div>
          <Link href={`/events/${event.id}`} className="btn-grad rounded-full px-5 py-2 text-sm font-semibold">Book now</Link>
        </div>
      </div>
    </article>
  );
}
