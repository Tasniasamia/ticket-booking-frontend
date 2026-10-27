import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { BookingPanel, type BookingAvailability } from "@/components/dashboard/events/booking-panel";
import { LocalTime } from "@/components/dashboard/events/local-time";
import { LiveRefresh } from "@/components/shared/live-refresh";
import { Section } from "@/components/shared/section";
import { T } from "@/components/shared/t";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicEventAction } from "@/features/event/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { getPaymentMethodsAction } from "@/features/payment-method/actions";
import { pickLanguage, textOf } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";

export const metadata: Metadata = { title: "Event | TicketBooking" };

type Props = { params: Promise<{ id: string }> };

function EventSkeleton() {
  return (
    <Section className="pt-10 sm:pt-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Skeleton className="aspect-video w-full rounded-4xl" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-96 rounded-4xl" />
      </div>
    </Section>
  );
}

async function EventContent({ params }: Props) {
  const { id } = await params;
  const [eventRes, methodsRes, langRes, saved] = await Promise.all([
    getPublicEventAction(id),
    getPaymentMethodsAction(),
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  if (eventRes.notFound || !eventRes.event) notFound();

  const event = eventRes.event;
  const lang = pickLanguage(langRes.languages ?? [], saved);
  const manager = event.manager;
  const gallery = event.images.filter((img) => img.url !== event.thumbnail?.url);
  const description = textOf(event.description, lang);

  const availability: BookingAvailability =
    new Date(event.starts_at) < new Date() ? "ended" : event.available_tickets <= 0 ? "sold_out" : "open";

  return (
    <Section className="pt-10 sm:pt-14">
      <LiveRefresh eventId={event.id} />
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="glass rounded-4xl p-3">
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-fg/5">
              {event.thumbnail && (
                <Image src={event.thumbnail.url} alt={textOf(event.title, lang)} fill priority sizes="(min-width:1024px) 60vw, 95vw" className="object-cover" />
              )}
            </div>
          </div>

          {gallery.length > 0 && (
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {gallery.map((img) => (
                <li key={img.id} className="glass relative aspect-square overflow-hidden rounded-2xl p-1.5">
                  <div className="relative size-full overflow-hidden rounded-xl">
                    <Image src={img.url} alt="" fill sizes="(min-width:640px) 15vw, 30vw" className="object-cover" />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-4xl">{textOf(event.title, lang)}</h1>
          <ul className="mt-5 flex flex-wrap gap-3 text-sm">
            <li className="glass flex items-center gap-2 rounded-full px-4 py-2"><CalendarDays className="size-4 text-coral" /><LocalTime iso={event.starts_at} /></li>
            <li className="glass flex items-center gap-2 rounded-full px-4 py-2"><MapPin className="size-4 text-coral" />{textOf(event.location, lang)}</li>
            <li className="glass flex items-center gap-2 rounded-full px-4 py-2"><Ticket className="size-4 text-coral" />{event.available_tickets.toLocaleString("en-US")} / {event.total_tickets.toLocaleString("en-US")}</li>
          </ul>

          {description !== "—" && (
            <>
              <h2 className="mt-10 text-xl font-bold"><T k="About this event" /></h2>
              <p className="mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-fg/70">{description}</p>
            </>
          )}

          {manager && (
            <Link href={`/managers/${manager.id}`} className="glass mt-8 flex max-w-md items-center gap-4 rounded-3xl p-4 transition hover:bg-fg/10">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-fg/10">
                {manager.image && <Image src={manager.image} alt="" fill sizes="56px" className="object-cover" />}
              </span>
              <span>
                <span className="block text-sm text-fg/55"><T k="Organised by" /></span>
                <span className="font-bold">{manager.name}</span>
                {manager.designation && <span className="block text-sm text-fg/60">{manager.designation}</span>}
              </span>
            </Link>
          )}
        </div>

        <BookingPanel event={event} paymentMethods={methodsRes.methods} availability={availability} />
      </div>
    </Section>
  );
}

export default function EventDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<EventSkeleton />}>
      <EventContent params={params} />
    </Suspense>
  );
}
