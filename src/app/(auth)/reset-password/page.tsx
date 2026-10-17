import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { PageHero } from "@/components/shared/page-hero";

export default function Page() {
  return (
    <div>
      <PageHero
        title="Reset Your Password"
        subtitle="Choose a strong new password to secure your account and get back to discovering amazing events."
      />

      {/* ResetPasswordForm এ useSearchParams আছে, তাই Suspense লাগে (verify-otp এর মতো) */}
      <Suspense fallback={<p className="text-center py-10">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
