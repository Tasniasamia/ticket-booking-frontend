"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { Mail, Ticket } from "lucide-react";
import { Container } from "./section";
import { NavLink } from "./nav-link";
import { useT } from "@/providers/preferences-provider";
import type { MessageKey } from "@/lib/i18n/messages";

type Column = { title: MessageKey; links: [MessageKey, string][] };
const COLUMNS: Column[] = [
  { title: "Explore", links: [["Events", "/events"], ["Managers", "/managers"], ["Blog", "/blog"], ["FAQ", "/faq"]] },
  { title: "Company", links: [["About us", "/about"], ["Services", "/#services"], ["Testimonials", "/#testimonials"], ["Contact", "/contact"]] },
  { title: "Support", links: [["My bookings", "/user/bookings"], ["Payments", "/user/payments"], ["Messages", "/user/messages"], ["Help centre", "/faq"]] },
];
const SOCIALS = [
  { icon: FaFacebookF, label: "Facebook" }, { icon: FaInstagram, label: "Instagram" },
  { icon: FaXTwitter, label: "X" }, { icon: FaYoutube, label: "YouTube" },
];

export function Footer() {
  const t = useT();
  return (
    <footer className="relative mt-8 border-t border-fg/10 bg-panel/60 w-full">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-magenta to-transparent" />
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr]">
        <div className="sm:max-w-sm ">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold">
            <span className="btn-grad grid size-9 place-items-center rounded-xl"><Ticket className="size-5 -rotate-12" /></span>
            TicketBooking
          </Link>
          <p className="mt-4 leading-relaxed text-fg/60">{t("Concerts, festivals and club nights from verified organisers. Pick an event, pay securely, walk in with your booking code.")}</p>
          <form className="glass  mt-6  flex items-center gap-2 rounded-full p-1 sm:p-1.5 sm:pl-4">
            <Mail className="size-4 shrink-0 text-fg/50" />
            <input type="email" required aria-label={t("Email address")} placeholder={t("Your email")} className="min-w-0 sm:flex-1 bg-transparent text-sm outline-none placeholder:text-fg/40" />
            <button className="cursor-pointer btn-grad rounded-full px-4 py-2 text-sm font-semibold">{t("Subscribe")}</button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h3 className="font-semibold">{t(c.title)}</h3>
              <ul className="mt-4 space-y-3 text-sm text-fg/60">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <NavLink
                      href={href}
                      className="inline-flex items-center gap-2 transition hover:translate-x-0.5 hover:text-coral"
                      activeClassName="font-semibold text-coral before:size-1.5 before:rounded-full before:bg-coral"
                    >
                      {t(label)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="border-t border-fg/10 ">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-fg/50 sm:flex-row">
          <p>{t("© TicketBooking. All rights reserved.")}</p>
          <ul className="flex gap-2.5">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <li key={label}>
                <a href="#" aria-label={label} className="glass grid size-10 place-items-center rounded-full transition hover:bg-fg/20 hover:text-fg">
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
