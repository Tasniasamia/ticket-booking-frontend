import type { Metadata } from "next";
import { Contact } from "@/components/home/contact";
import { PageHero } from "@/components/shared/page-hero";
import { T } from "@/components/shared/t";

export const metadata: Metadata = { title: "Contact | TicketBooking" };

export default function ContactPage() {
  return (
    <>
      <PageHero title={<T k="Contact us" />} subtitle={<T k="Questions about a booking or an event? Send us a message." />} />
      <Contact />
    </>
  );
}
