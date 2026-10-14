import type { Metadata } from "next";
import { EventsExplorer } from "@/components/events/events-explorer";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";

export const metadata: Metadata = { title: "Events | TicketBooking" };

export default function EventsPage() {
  return (
    <>
      <PageHero title="Find your next event" subtitle="Search by name or city, or filter by category." />
      <Section className="pt-10 sm:pt-12"><EventsExplorer /></Section>
    </>
  );
}
