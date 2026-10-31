import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, MessageCircle } from "lucide-react";
import { EventCard } from "@/components/dashboard/events/event-card";
import { Section, SectionHeading } from "@/components/shared/section";
import { getPublicManagerAction } from "@/features/user/actions";
import { getPublicEventsAction } from "@/features/event/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { getLanguageCookie } from "@/lib/preferences";
import { pickLanguage } from "@/lib/localized";

type Props = { params: Promise<{ id: string }> };

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=700&q=70";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getPublicManagerAction(id);
  return {
    title: res.manager ? `${res.manager.name} | TicketBooking` : "Manager not found",
  };
}

export default async function ManagerDetailsPage({ params }: Props) {
  const { id } = await params;

  const [managerRes, langRes, saved] = await Promise.all([
    getPublicManagerAction(id),
    getLanguagesAction(),
    getLanguageCookie(),
  ]);

  if (!managerRes.success || !managerRes.manager) notFound();

  const m = managerRes.manager;
  const lang = pickLanguage(langRes.languages ?? [], saved);

  // Public events filtered by this manager (query filter: manager_id)
  const eventsRes = await getPublicEventsAction(
    {
      page: 1,
      limit: 24,
      search: "",
      filters: { manager_id: String(m.id) },
    },
    lang,
  );
  const events = eventsRes.events ?? [];

  const image = m.profile_image || PLACEHOLDER;
  const org = m.designation || m.country || "Event Manager";
  const firstName = m.name.split(" ")[0] || m.name;

  return (
    <Section className="pt-10 sm:pt-14">
      <div className="glass grid items-center gap-8 rounded-4xl p-6 sm:p-8 md:grid-cols-[16rem_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-64 overflow-hidden rounded-3xl bg-fg/5">
          <Image src={image} alt={m.name} fill priority sizes="256px" className="object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{m.name}</h1>
          <p className="mt-1 text-lg text-fg/65">{org}</p>
          {(m.country || m.phone_number) && (
            <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-fg/60">
              {m.country ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {m.country}
                </span>
              ) : null}
              {m.phone_number ? <span>{m.phone_number}</span> : null}
            </p>
          )}
          <p className="mt-4 max-w-xl leading-relaxed text-fg/70">
            {m.designation
              ? `${m.name} is an event manager (${m.designation}). Ask about seating, entry times or group bookings.`
              : "Runs live events and answers messages quickly. Ask about seating, entry times or group bookings."}
          </p>
          <Link
            href={`/user/messages?to=${m.id}`}
            className="btn-grad mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold"
          >
            <MessageCircle className="size-4" />
            Message {firstName}
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <SectionHeading title={`Events by ${firstName}`} />
        {events.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="text-fg/60">No upcoming events right now.</p>
        )}
      </div>
    </Section>
  );
}
