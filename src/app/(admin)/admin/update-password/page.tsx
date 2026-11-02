import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/profile/update-password";

export const metadata: Metadata = { title: "Update password" };

export default function AdminUpdatePasswordPage() {
  return (
    <>
      <div className="rounded-3xl border border-fg/10 bg-panel/60 p-6 sm:p-8">
        <UpdatePasswordForm />
      </div>
    </>
  );
}