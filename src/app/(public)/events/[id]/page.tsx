import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { BookingPanel } from "@/components/events/booking-panel";
import { Section } from "@/components/shared/section";
import { EVENTS, MANAGERS } from "@/lib/mock-data";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const e = EVENTS.find((x) => x.id === id);
  return { title: e ? `${e.title} | TicketBooking` : "Event not found" };
}

export default async function EventDetailsPage({ params }: Props) {
  const { id } = await params;
  const event = EVENTS.find((e) => e.id === id);
  if (!event) notFound();
  const manager = MANAGERS.find((m) => m.id === event.managerId)!;

  return (
    <Section className="pt-10 sm:pt-14">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="glass rounded-4xl p-3">
            <div className="relative aspect-video overflow-hidden rounded-3xl">
              <Image src={event.image} alt={event.title} fill priority sizes="(min-width:1024px) 60vw, 95vw" className="object-cover" />
            </div>
          </div>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-4xl">{event.title}</h1>
          <ul className="mt-5 flex flex-wrap gap-3 text-sm">
            <li className="glass flex items-center gap-2 rounded-full px-4 py-2"><CalendarDays className="size-4 text-coral" />{event.day} {event.month}</li>
            <li className="glass flex items-center gap-2 rounded-full px-4 py-2"><MapPin className="size-4 text-coral" />{event.location}</li>
            <li className="glass flex items-center gap-2 rounded-full px-4 py-2"><Users className="size-4 text-coral" />{event.going.toLocaleString("en-US")} going</li>
          </ul>
          <h2 className="mt-10 text-xl font-bold">About this event</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-fg/70">
            A live {event.category.toLowerCase()} night with full sound and lighting. Doors open two hours before the start. Show your booking code at the gate to enter.
          </p>
          <Link href={`/managers/${manager.id}`} className="glass mt-8 flex max-w-md items-center gap-4 rounded-3xl p-4 transition hover:bg-fg/10">
            <span className="relative size-14 overflow-hidden rounded-full"><Image src={manager.image} alt="" fill sizes="56px" className="object-cover" /></span>
            <span><span className="block text-sm text-fg/55">Organised by</span><span className="font-bold">{manager.name}</span><span className="block text-sm text-fg/60">{manager.org}</span></span>
          </Link>
        </div>
        <BookingPanel price={event.price} />
      </div>
    </Section>
  );
}
