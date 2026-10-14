import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { PageHero } from "@/components/shared/page-hero";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHero
        title="Reset Your Password"
        subtitle="Choose a strong new password to secure your account and get back to discovering amazing events."
      />

      <ResetPasswordForm />
    </div>
  );
};

export default page;
