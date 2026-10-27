import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { PageHero } from "@/components/shared/page-hero2";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHero
      title="Forgot Your Password?"
      subtitle="No worries! Enter your registered email address and we'll help you reset your password."
      />
     <ForgotPasswordForm />
     </div>
  );
};

export default page;
