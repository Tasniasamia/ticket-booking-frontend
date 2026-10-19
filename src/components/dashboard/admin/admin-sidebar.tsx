"use client";

import Link from "next/link";
import {
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  Ticket,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_MENU, type AdminMenuItem } from "./admin-menu";

type AdminSidebarProps = {
  activeHref: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

export function AdminSidebar({
  activeHref,
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: AdminSidebarProps) {
  return (
    <>
      {/* মোবাইলে drawer খুললে পেছনের অন্ধকার পর্দা */}
      <div
        aria-hidden
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity motion-reduce:transition-none lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        id="admin-sidebar"
        aria-label="Admin sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-fg/10 bg-panel/95 backdrop-blur-xl",
          "transition-[transform,width,visibility] duration-200 motion-reduce:transition-none",
          mobileOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full lg:visible lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-72",
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center justify-between gap-2 border-b border-fg/10 px-4",
            collapsed && "lg:justify-center lg:px-0",
          )}
        >
          <Link
            href="/admin"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-coral"
          >
            <span className="btn-grad grid size-9 shrink-0 place-items-center rounded-xl">
              <Ticket className="size-5 -rotate-12" />
            </span>
            <span className={cn("leading-tight", collapsed && "lg:hidden")}>
              <span className="block text-base font-extrabold tracking-tight">
                TicketBooking
              </span>
              <span className="block text-xs text-fg/50">Admin console</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="grid size-9 cursor-pointer place-items-center rounded-lg hover:bg-fg/10 focus-visible:outline-2 focus-visible:outline-coral lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Menu */}
        <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
          {ADMIN_MENU.map((group, gi) => (
            <div
              key={group.label ?? gi}
              className={cn(
                gi > 0 && "mt-6",
                gi > 0 && collapsed && "lg:mt-4 lg:border-t lg:border-fg/10 lg:pt-4",
              )}
            >
              {group.label && (
                <p
                  className={cn(
                    "mb-2 px-3 text-xs font-semibold text-fg/40",
                    collapsed && "lg:hidden",
                  )}
                >
                  {group.label}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavItem
                      item={item}
                      active={item.href === activeHref}
                      collapsed={collapsed}
                      onNavigate={onCloseMobile}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 space-y-1 border-t border-fg/10 p-3">
          <Link
            href="/"
            title={collapsed ? "View website" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg/65 transition-colors hover:bg-fg/5 hover:text-fg focus-visible:outline-2 focus-visible:outline-coral",
              collapsed && "lg:justify-center lg:px-0",
            )}
          >
            <ExternalLink className="size-5 shrink-0" />
            <span className={cn(collapsed && "lg:sr-only")}>View website</span>
          </Link>

          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-pressed={collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg/65 transition-colors hover:bg-fg/5 hover:text-fg focus-visible:outline-2 focus-visible:outline-coral lg:flex",
              collapsed && "lg:justify-center lg:px-0",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5 shrink-0" />
            ) : (
              <PanelLeftClose className="size-5 shrink-0" />
            )}
            <span className={cn(collapsed && "lg:sr-only")}>Collapse sidebar</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: AdminMenuItem;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-coral",
        collapsed && "lg:justify-center lg:px-0",
        active
          ? "bg-fg/10 text-fg"
          : "text-fg/65 hover:bg-fg/5 hover:text-fg",
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-linear-to-b from-magenta to-coral"
        />
      )}
      <Icon className={cn("size-5 shrink-0", active && "text-coral")} />
      <span className={cn(collapsed && "lg:sr-only")}>{item.label}</span>
    </Link>
  );
}
