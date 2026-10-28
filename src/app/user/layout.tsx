"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, Ticket, Wallet, MessageCircle } from "lucide-react";

import Sidebar, { type MenuItem } from "@/components/dashboard/shared/sidebar";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { PageHero } from "@/components/shared/page-hero2";
import { Container } from "@/components/shared/section";
import { ProfileSkeleton } from "@/components/skeleton/profileSkeleton";
import { useUser } from "@/providers/user-provider";

const userMenu: MenuItem[] = [
  {
    key: 1,
    label: "Dashboard",
    link: "/user",
    icon: <LayoutDashboard size={16} />,
    title: "Dashboard",
    subtitle: "Overview of your account activity.",
  },
  {
    key: 2,
    label: "My Bookings",
    link: "/user/bookings",
    icon: <Ticket size={16} />,
    title: "My bookings",
    subtitle: "Tickets you have booked, with dates and status.",
  },
  {
    key: 3,
    label: "My Payments",
    link: "/user/payments",
    icon: <Wallet size={16} />,
    title: "My payments",
    subtitle: "Payment history with amounts and paid dates.",
  },
  {
    key: 5,
    label: "Messages",
    link: "/user/messages",
    icon: <MessageCircle size={16} />,
    title: "Messages",
    subtitle: "Chat with admin and event managers after you book.",
  },
  {
    key: 4,
    label: "Profile",
    link: "/user/profile",
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
    [...userMenu]
      .sort((a, b) => b.link.length - a.link.length)
      .find((m) => pathname === m.link || pathname.startsWith(m.link + "/")) ??
    userMenu[0];

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
              <Sidebar user={user} menu={userMenu} activeKey={current.key} />
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
