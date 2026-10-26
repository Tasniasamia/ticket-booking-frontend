"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { CurrencySwitcher, LanguageSwitcher } from "./header-switchers";
import { Dropdown } from "./dropdown";
import { logoutAction } from "@/features/auth/actions";
// import type { Profile } from "@/features/user/profile";
// import { useUser } from "./user-provider";
import { ThemeToggle } from "./theme-toggle";
import { NavLink } from "./nav-link";
import { Container } from "./section";
import { useUser } from "@/providers/user-provider";
import { Profile } from "@/features/user/type";
import { useT } from "@/providers/preferences-provider";
import type { MessageKey } from "@/lib/i18n/messages";
import { UserAvatar } from "./use-avatar";
import { SiteLogo } from "./site-logo";

const NAV: { href: string; label: MessageKey }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/managers", label: "Managers" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, status } = useUser();
  const t = useT();

  return (
    <header className="sticky top-0 z-40 border-b border-fg/10 bg-bg/70 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <SiteLogo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.href}
              href={n.href}
              className="relative rounded-full px-4 py-2 text-sm font-medium text-fg/70 transition hover:bg-fg/10 hover:text-fg"
              activeClassName="bg-fg/10 font-semibold text-fg  after:rounded-full "
            >
              {t(n.label)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2.5 sm:flex">
            <LanguageSwitcher />
            <CurrencySwitcher />
          </div>
          <ThemeToggle />

          {status === "loading" ? (
            // /auth/me এর উত্তর আসা পর্যন্ত Log in / Sign up না দেখিয়ে placeholder
            <div aria-hidden className="h-10 w-10 animate-pulse rounded-full bg-fg/10 md:w-44" />
          ) : user ? <UserMenu user={user} /> : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-fg/10">{t("Log in")}</Link>
              <Link href="/register" className="btn-grad rounded-full px-5 py-2.5 text-sm font-semibold">{t("Sign up")}</Link>
            </div>
          )}

          <button
            type="button"
            className="glass cursor-pointer grid size-10 place-items-center rounded-full xl:hidden"
            aria-label={open ? t("Close menu") : t("Open menu")}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-fg/10 bg-panel/95 backdrop-blur-xl xl:hidden">
          <Container className="space-y-4 py-5">
            <nav aria-label="Mobile" className="grid gap-1">
              {NAV.map((n) => (
                <NavLink
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl border-l-0 borer-transparent px-3 py-3 font-medium text-fg/75 hover:bg-fg/10 hover:text-fg"
                  activeClassName="border-[#c936b4] border-l-4 bg-fg/10 font-semibold text-fg"
                >
                  {t(n.label)}
                </NavLink>
              ))}
            </nav>
            <div className="flex flex-wrap gap-2.5 sm:hidden"><LanguageSwitcher /><CurrencySwitcher /></div>
            {status === "unauthenticated" && (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" className="glass rounded-full py-3 text-center font-semibold">{t("Log in")}</Link>
                <Link href="/register" className="btn-grad rounded-full py-3 text-center font-semibold">{t("Sign up")}</Link>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}

function UserMenu({ user }: { user: Profile }) {
  const { clear } = useUser();
  const t = useT();
  const [pending, startTransition] = useTransition();
  const base = `/${user.role}`;
  const row = "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm hover:bg-fg/10";
  return (
    <Dropdown
      label={t("Account menu")}
      className="flex items-center gap-2 rounded-full glass py-1 pl-1 pr-3"
      trigger={<><UserAvatar name={user.name} image={user.profile_image} className="size-8 text-sm" /><span className="hidden max-w-24 truncate text-sm font-medium md:block">{user.name.split(" ")[0]}</span></>}
    >
      {(close) => (
        <>
          <div className="mb-1 flex items-center gap-3 border-b border-fg/10 px-3 pb-3 pt-2">
            <UserAvatar name={user.name} image={user.profile_image} />
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name}</p><p className="text-xs capitalize text-fg/50">{user.role}</p></div>
          </div>
          <Link role="menuitem" href={base} onClick={close} className={row}><LayoutDashboard className="size-4" />{t("Dashboard")}</Link>
          <Link role="menuitem" href={`${base}/profile`} onClick={close} className={row}><User className="size-4" />{t("Profile")}</Link>
          <button
            role="menuitem"
            disabled={pending}
            onClick={() => startTransition(async () => { clear(); await logoutAction(); })}
            className={`${row} text-coral cursor-pointer disabled:opacity-60`}
          >
            <LogOut className="size-4" />{t("Log out")}
          </button>
        </>
      )}
    </Dropdown>
  );
}
