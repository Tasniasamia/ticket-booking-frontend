import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { Section, SectionHeading } from "@/components/shared/section";
import { EVENTS, MANAGERS } from "@/lib/mock-data";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return MANAGERS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const m = MANAGERS.find((x) => x.id === id);
  return { title: m ? `${m.name} | TicketBooking` : "Manager not found" };
}

export default async function ManagerDetailsPage({ params }: Props) {
  const { id } = await params;
  const m = MANAGERS.find((x) => x.id === id);
  if (!m) notFound();
  const events = EVENTS.filter((e) => e.managerId === m.id);

  return (
    <Section className="pt-10 sm:pt-14">
      <div className="glass grid items-center gap-8 rounded-4xl p-6 sm:p-8 md:grid-cols-[16rem_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-64 overflow-hidden rounded-3xl">
          <Image src={m.image} alt={m.name} fill priority sizes="256px" className="object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{m.name}</h1>
          <p className="mt-1 text-lg text-fg/65">{m.org}</p>
          <p className="mt-4 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5"><Star className="size-4 fill-coral text-coral" />{m.rating} rating</span>
            <span>{m.events} events hosted</span>
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-fg/70">Runs live music and nightlife events and answers messages within a day. Ask about seating, entry times or group bookings.</p>
          <button className="btn-grad mt-6 rounded-full px-8 py-3 font-semibold">Message {m.name.split(" ")[0]}</button>
        </div>
      </div>

      <div className="mt-16">
        <SectionHeading title={`Events by ${m.name.split(" ")[0]}`} />
        {events.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{events.map((e) => <EventCard key={e.id} event={e} />)}</div>
        ) : <p className="text-fg/60">No upcoming events right now.</p>}
      </div>
    </Section>
  );
}
