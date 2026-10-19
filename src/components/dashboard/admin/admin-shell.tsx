"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/providers/user-provider";
import { AdminHeader } from "./admin-header";
import { findActiveItem } from "./admin-menu";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, status } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false); // desktop: সরু sidebar
  const [mobileOpen, setMobileOpen] = useState(false); // mobile: drawer

  const current = findActiveItem(pathname);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  // drawer খোলা থাকলে: Esc দিয়ে বন্ধ, পেছনের page scroll বন্ধ
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setMobileOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="page-glow min-h-screen">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-panel focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      <AdminSidebar
        activeHref={current.href}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-200 motion-reduce:transition-none",
          collapsed ? "lg:pl-20" : "lg:pl-72",
        )}
      >
        <AdminHeader
          pageLabel={current.label}
          mobileOpen={mobileOpen}
          onOpenMenu={() => setMobileOpen(true)}
        />

        <main id="admin-main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl min-w-0">
            {user ? children : <MainSkeleton />}
          </div>
        </main>
      </div>
    </div>
  );
}

function MainSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-6">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-fg/10" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-fg/10" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-fg/10" />
    </div>
  );
}
