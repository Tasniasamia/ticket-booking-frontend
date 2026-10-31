"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "react-toastify";
import { Section, SectionHeading } from "@/components/shared/section";
import { section, textOf } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import { useT } from "@/providers/preferences-provider";
import { submitContactAction } from "@/features/contact/actions";
import { useRouter } from "next/navigation";

const field =
  "w-full rounded-2xl border border-fg/10 bg-panel/40 px-4 py-3 text-sm outline-none transition placeholder:text-fg/40 focus:border-coral";

export function Contact({ content, lang }: { content?: PageContent; lang: string }) {
  const t = useT();
  const c = section(content, "contact");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const router=useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await submitContactAction({ name, email, subject, message });
    setLoading(false);
    if (res.success) {
      toast.success(res.message ?? "Message sent.");
      router.refresh();
      setName(""); setEmail(""); setSubject(""); setMessage("");
      return;
    }
    toast.error(res.message ?? "Could not send.");
  };

  const info = [
    { icon: Mail, label: t("Email"), value: "hello@ticketbooking.com" },
    { icon: Phone, label: t("Phone"), value: "+880 1700-000000" },
    { icon: MapPin, label: t("Address"), value: "Dhaka, Bangladesh" },
  ];

  return (
    <Section id="contact">
      <SectionHeading title={textOf(c.title, lang)} subtitle={textOf(c.subtitle, lang)} />
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ul className="space-y-5">
            {info.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="grid size-11 place-items-center rounded-2xl bg-fg/5">
                  <Icon className="size-5 text-coral" />
                </span>
                <div>
                  <p className="text-sm text-fg/55">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={onSubmit} className="glass space-y-4 rounded-4xl p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required aria-label={t("Name")} placeholder={t("Your name")} className={field} value={name} onChange={(e) => setName(e.target.value)} />
            <input required type="email" aria-label={t("Email")} placeholder={t("Your email")} className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <input required aria-label={t("Subject")} placeholder={t("Subject")} className={field} value={subject} onChange={(e) => setSubject(e.target.value)} />
          <textarea required rows={5} aria-label={t("Message")} placeholder={t("How can we help?")} className={field} value={message} onChange={(e) => setMessage(e.target.value)} />
          <button disabled={loading} className="btn-grad w-full cursor-pointer rounded-full py-3.5 font-semibold disabled:opacity-60 sm:w-auto sm:px-10">
            {loading ? t("Sending...") : t("Send message")}
          </button>
        </form>
      </div>
    </Section>
  );
}
