"use client";

import { Ticket } from "lucide-react";
import { useSiteSettings } from "@/providers/site-settings-provider";

/** Header আর footer এর logo + নাম। Site settings এ logo/নাম না থাকলে আগের ticket icon আর "TicketBooking"। */
export function SiteLogo() {
  const { site_logo, site_name } = useSiteSettings();
  return (
    <>
      {site_logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={site_logo} alt="" className="size-9 rounded-xl object-cover" />
      ) : (
        <span className="btn-grad grid size-9 place-items-center rounded-xl"><Ticket className="size-5 -rotate-12" /></span>
      )}
      {site_name || "TicketBooking"}
    </>
  );
}
