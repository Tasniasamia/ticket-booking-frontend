import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import { PageHeader } from "@/components/dashboard/shared/page-header";

export const metadata: Metadata = { title: "My profile" };

export default function AdminProfilePage() {
  return (
    <>
      <PageHeader
        title="My profile"
        subtitle="Your account details. Keep them up to date."
      />
      <div className="rounded-3xl border border-fg/10 bg-panel/60 p-6 sm:p-8">
        <ProfileView />
      </div>
    </>
  );
}
