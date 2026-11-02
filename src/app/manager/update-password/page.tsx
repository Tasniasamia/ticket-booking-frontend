import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/profile/update-password";

export const metadata: Metadata = { title: "Update password | TicketBooking" };

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}