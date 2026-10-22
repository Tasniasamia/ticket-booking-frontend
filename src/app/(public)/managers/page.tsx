import type { Metadata } from "next";
import { ManagerCard } from "@/components/managers/manager-card";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { T } from "@/components/shared/t";
import { MANAGERS } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Event managers | TicketBooking" };

export default function ManagersPage() {
  return (
    <>
      <PageHero title={<T k="Event managers" />} subtitle={<T k="Verified organisers behind the shows. Open a profile to see their events." />} />
      <Section className="pt-10 sm:pt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MANAGERS.map((m) => <ManagerCard key={m.id} m={m} />)}
        </div>
      </Section>
    </>
  );
}
