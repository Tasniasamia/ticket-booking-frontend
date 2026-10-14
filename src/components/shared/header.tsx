"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, Ticket, User, X } from "lucide-react";
import { CurrencySwitcher, LanguageSwitcher } from "./header-switchers";
import { Dropdown } from "./dropdown";
import { UserAvatar } from "./user-avatar";
import { Container } from "./section";

export type HeaderUser = { name: string; image?: string | null; role: "user" | "manager" | "admin" } | null;

const NAV = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/#managers", label: "Managers" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export function Header({ user }: { user: HeaderUser }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/60 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <span className="btn-grad grid size-9 place-items-center rounded-xl"><Ticket className="size-5 -rotate-12" /></span>
          TicketBooking
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2.5 sm:flex">
            <LanguageSwitcher />
            <CurrencySwitcher />
          </div>

          {user ? <UserMenu user={user} /> : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-white/10">Log in</Link>
              <Link href="/register" className="btn-grad rounded-full px-5 py-2.5 text-sm font-semibold">Sign up</Link>
            </div>
          )}

          <button
            type="button"
            className="glass grid size-10 place-items-center rounded-full lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-white/10 bg-plum/95 backdrop-blur-xl lg:hidden">
          <Container className="space-y-4 py-5">
            <nav aria-label="Mobile" className="grid gap-1">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-medium hover:bg-white/10">
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-wrap gap-2.5 sm:hidden"><LanguageSwitcher /><CurrencySwitcher /></div>
            {!user && (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" className="glass rounded-full py-3 text-center font-semibold">Log in</Link>
                <Link href="/register" className="btn-grad rounded-full py-3 text-center font-semibold">Sign up</Link>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}

function UserMenu({ user }: { user: NonNullable<HeaderUser> }) {
  const base = `/${user.role}`;
  const row = "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm hover:bg-white/10";
  return (
    <Dropdown
      label="Account menu"
      className="flex items-center gap-2 rounded-full glass py-1 pl-1 pr-3"
      trigger={<><UserAvatar name={user.name} image={user.image} className="size-8 text-sm" /><span className="hidden max-w-24 truncate text-sm font-medium md:block">{user.name.split(" ")[0]}</span></>}
    >
      {(close) => (
        <>
          <div className="mb-1 flex items-center gap-3 border-b border-white/10 px-3 pb-3 pt-2">
            <UserAvatar name={user.name} image={user.image} />
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name}</p><p className="text-xs capitalize text-white/50">{user.role}</p></div>
          </div>
          <Link role="menuitem" href={base} onClick={close} className={row}><LayoutDashboard className="size-4" />Dashboard</Link>
          <Link role="menuitem" href={`${base}/profile`} onClick={close} className={row}><User className="size-4" />Profile</Link>
          {/* TODO: logout Server Action এ বদলাও */}
          <button role="menuitem" className={`${row} text-coral`}><LogOut className="size-4" />Log out</button>
        </>
      )}
    </Dropdown>
  );
}
