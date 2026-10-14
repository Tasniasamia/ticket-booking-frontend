import type { Metadata } from "next";
import { Contact } from "@/components/home/contact";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = { title: "Contact | TicketBooking" };

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact us" subtitle="Questions about a booking or an event? Send us a message." />
      <Contact />
    </>
  );
}
