import { VerifyOtpForm } from "@/components/auth/verify-otp-form";
import { PageHero } from "@/components/shared/page-hero";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHero
        title="Verify Your Email"
        subtitle="We've sent a verification code to your email address. Enter the code below to verify your identity."
      />

      <VerifyOtpForm />
    </div>
  );
};

export default page;
