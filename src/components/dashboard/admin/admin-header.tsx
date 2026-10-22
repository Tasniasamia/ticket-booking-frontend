"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ChevronDown, ChevronRight, ExternalLink, LogOut, Menu, UserRound } from "lucide-react";
import { Dropdown } from "@/components/shared/dropdown";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { logoutAction } from "@/features/auth/actions";
import type { Profile } from "@/features/user/type";
import { useUser } from "@/providers/user-provider";
import { UserAvatar } from "@/components/shared/use-avatar";

type AdminHeaderProps = {
  pageLabel: string;
  mobileOpen: boolean;
  onOpenMenu: () => void;
};

export function AdminHeader({ pageLabel, mobileOpen, onOpenMenu }: AdminHeaderProps) {
  const { user, status } = useUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-fg/10 bg-bg/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        aria-controls="admin-sidebar"
        aria-expanded={mobileOpen}
        className="glass grid size-10 shrink-0 cursor-pointer place-items-center rounded-full transition hover:bg-fg/10 focus-visible:outline-2 focus-visible:outline-coral lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link href="/admin" className="hidden text-fg/50 hover:text-fg sm:block">
          Admin
        </Link>
        <ChevronRight aria-hidden className="hidden size-4 text-fg/30 sm:block" />
        <span aria-current="page" className="truncate font-semibold">
          {pageLabel}
        </span>
      </nav>

      <div className="ml-auto flex items-center gap-2.5">
        <Link
          href="/"
          className="glass hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition hover:bg-fg/10 focus-visible:outline-2 focus-visible:outline-coral md:flex"
        >
          <ExternalLink className="size-4" />
          View website
        </Link>

        <ThemeToggle />

        {status === "loading" || !user ? (
          <div aria-hidden className="h-10 w-10 animate-pulse rounded-full bg-fg/10 md:w-40" />
        ) : (
          <AdminUserMenu user={user} />
        )}
      </div>
    </header>
  );
}

function AdminUserMenu({ user }: { user: Profile }) {
  const { clear } = useUser();
  const [pending, startTransition] = useTransition();
  const row =
    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm hover:bg-fg/10";

  return (
    <Dropdown
      label="Account menu"
      className="glass flex h-10 items-center gap-2 rounded-full py-1 pl-1 pr-3"
      trigger={
        <>
          <UserAvatar name={user.name} image={user.profile_image} className="size-8 text-sm" />
          <span className="hidden max-w-28 truncate text-sm font-medium md:block">
            {user.name.split(" ")[0]}
          </span>
          <ChevronDown aria-hidden className="hidden size-3.5 opacity-70 md:block" />
        </>
      }
    >
      {(close) => (
        <>
          <div className="mb-1 flex items-center gap-3 border-b border-fg/10 px-3 pb-3 pt-2">
            <UserAvatar name={user.name} image={user.profile_image} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-fg/50">{user.email}</p>
            </div>
          </div>
          <Link role="menuitem" href="/admin/profile" onClick={close} className={row}>
            <UserRound className="size-4" />
            Profile
          </Link>
          <Link role="menuitem" href="/" onClick={close} className={row}>
            <ExternalLink className="size-4" />
            View website
          </Link>
          <button
            role="menuitem"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                clear();
                await logoutAction();
              })
            }
            className={`${row} cursor-pointer text-coral disabled:opacity-60`}
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </>
      )}
    </Dropdown>
  );
}
