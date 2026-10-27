import { Suspense } from "react";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";
import { PageHero } from "@/components/shared/page-hero2";

export default function Page() {
  return (
    <div>
      <PageHero
        title="Verify Your Email"
        subtitle="We've sent a verification code to your email address. Enter the code below to verify your identity."
      />

      <Suspense fallback={<p className="text-center py-10">Loading...</p>}>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}