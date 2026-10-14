import { RegisterForm } from "@/components/auth/register-form";
import { PageHero } from "@/components/shared/page-hero";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHero
        title="Create Your Account"
        subtitle="Join us to discover exciting events, book your tickets, and make every moment memorable."
      />

      <RegisterForm />
    </div>
  );
};

export default page;
