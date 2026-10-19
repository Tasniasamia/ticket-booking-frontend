import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";

export const metadata: Metadata = { title: "My profile | TicketBooking" };

export default function ProfilePage() {
  return (
    <>
      <Section className="pt-8 sm:pt-10"><ProfileView /></Section>
    </>
  );
}
