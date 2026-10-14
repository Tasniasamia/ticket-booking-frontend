import { LoginForm } from "@/components/auth/login-form";
import { PageHero } from "@/components/shared/page-hero";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHero
        title="Login"
        subtitle="Sign in to discover live events, manage your bookings, and never miss a moment."
      />

      <LoginForm />
    </div>
  );
};

export default page;
