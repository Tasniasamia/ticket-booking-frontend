import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";

export const metadata: Metadata = { title: "My profile | TicketBooking" };

export default function ProfilePage() {
  return (
    <>
      <PageHero title="My profile" subtitle="Your account details. Keep them up to date so bookings and messages reach you." />
      <Section className="pt-8 sm:pt-10"><ProfileView /></Section>
    </>
  );
}
