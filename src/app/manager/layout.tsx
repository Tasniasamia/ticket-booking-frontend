"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, CalendarDays, Ticket, Wallet } from "lucide-react";

import Sidebar, { type MenuItem } from "@/components/dashboard/shared/sidebar";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { PageHero } from "@/components/shared/page-hero2";
import { Container } from "@/components/shared/section";
import { ProfileSkeleton } from "@/components/skeleton/profileSkeleton";
import { useUser } from "@/providers/user-provider";

const managerMenu: MenuItem[] = [
  {
    key: 1,
    label: "Dashboard",
    link: "/manager",
    icon: <LayoutDashboard size={16} />,
    title: "Dashboard",
    subtitle: "Overview of your events and sales.",
  },
  {
    key: 2,
    label: "Events",
    link: "/manager/events",
    icon: <CalendarDays size={16} />,
    title: "Events",
    subtitle: "Create and manage your events.",
  },
  {
    key: 3,
    label: "Bookings",
    link: "/manager/bookings",
    icon: <Ticket size={16} />,
    title: "Event bookings",
    subtitle: "Bookings for events you manage, with dates.",
  },
  {
    key: 4,
    label: "Payments",
    link: "/manager/payments",
    icon: <Wallet size={16} />,
    title: "Event payments",
    subtitle: "Payments for your events with paid dates and totals.",
  },
  {
    key: 5,
    label: "Profile",
    link: "/manager/profile",
    icon: <User size={16} />,
    title: "My profile",
    subtitle:
      "Your account details. Keep them up to date so bookings and messages reach you.",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, status } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const current =
    [...managerMenu]
      .sort((a, b) => b.link.length - a.link.length)
      .find((m) => pathname === m.link || pathname.startsWith(m.link + "/")) ??
    managerMenu[0];

  return (
    <div className="page-glow flex  flex-col">
      <Header />

      <Container>
        <PageHero title={current.title} subtitle={current.subtitle} />

        {!user ? (
          <ProfileSkeleton />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[18rem_1fr]">
            <div>
              <Sidebar user={user} menu={managerMenu} activeKey={current.key} />
            </div>

            <div className="min-w-0 rounded-3xl border border-fg/15 bg-panel/60 p-6 sm:p-8">
              {children}
            </div>
          </div>
        )}
      </Container>

      <Footer />
    </div>
  );
}
