"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/shared/section";
import { useT } from "@/providers/preferences-provider";
import type { MessageKey } from "@/lib/i18n/messages";

const INFO: { icon: typeof Mail; label: MessageKey; value: string }[] = [
  { icon: Mail, label: "Email", value: "support@ticketbooking.com" },
  { icon: Phone, label: "Phone", value: "+880 1700 000000" },
  { icon: MapPin, label: "Office", value: "Khulna, Bangladesh" },
];
const field = "w-full rounded-2xl border border-fg/15 bg-fg/5 px-4 py-3 outline-none transition placeholder:text-fg/40 focus:border-coral";

export function Contact() {
  const [sent, setSent] = useState(false);
  const t = useT();
  return (
    <Section id="contact">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading title={t("Questions? Talk to us")} subtitle={t("We reply within one working day.")} className="mb-8" />
          <ul className="space-y-4">
            {INFO.map(({ icon: Icon, label, value }) => (
              <li key={label} className="glass flex items-center gap-4 rounded-3xl p-4">
                <span className="btn-grad grid size-12 place-items-center rounded-2xl"><Icon className="size-5" /></span>
                <div><p className="text-sm text-fg/55">{t(label)}</p><p className="font-semibold">{value}</p></div>
              </li>
            ))}
          </ul>
        </div>

        {/* TODO: react-hook-form + zod + Server Action দিয়ে বদলাও */}
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="glass space-y-4 rounded-4xl p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required aria-label={t("Name")} placeholder={t("Your name")} className={field} />
            <input required type="email" aria-label={t("Email")} placeholder={t("Your email")} className={field} />
          </div>
          <input required aria-label={t("Subject")} placeholder={t("Subject")} className={field} />
          <textarea required rows={5} aria-label={t("Message")} placeholder={t("How can we help?")} className={field} />
          <button className="btn-grad cursor-pointer w-full rounded-full py-3.5 font-semibold sm:w-auto sm:px-10">{t("Send message")}</button>
          {sent && <p role="status" className="text-sm text-coral">{t("Message sent. We will reply by email.")}</p>}
        </form>
      </div>
    </Section>
  );
}


