import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "@/components/shared/section";
import { T } from "@/components/shared/t";
import { IMAGES } from "@/lib/mock-data";
import type { MessageKey } from "@/lib/i18n/messages";

const POINTS: MessageKey[] = ["Verified organisers and managers only", "One booking code per ticket, checked at the gate", "Prices in your own currency and language"];

export function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative mx-auto h-105 w-full max-w-lg sm:h-120">
          <div className="glass absolute left-0 top-0 h-[78%] w-[68%] -rotate-3 rounded-4xl p-2.5">
            <div className="relative size-full overflow-hidden rounded-3xl">
              <Image src={IMAGES.about1} alt="Singer performing on stage" fill sizes="340px" className="object-cover" />
            </div>
          </div>
          <div className="glass absolute bottom-0 right-0 h-[58%] w-[52%] rotate-3 rounded-4xl p-2.5">
            <div className="relative size-full overflow-hidden rounded-3xl">
              <Image src={IMAGES.about2} alt="Lights over a festival crowd" fill sizes="280px" className="object-cover" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl"><T k="We make going out simple" /></h2>
          <p className="mt-4 max-w-lg leading-relaxed text-fg/70">
            <T k="TicketBooking connects people with live events and the managers who run them. Browse, compare and book without queues, then message the organiser if you need help." />
          </p>
          <ul className="mt-7 space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="btn-grad grid size-7 shrink-0 place-items-center rounded-full"><Check className="size-4" /></span>
                <T k={p} />
              </li>
            ))}
          </ul>
          <Link href="/events" className="btn-grad mt-9 inline-block rounded-full px-8 py-3.5 font-semibold"><T k="Browse events" /></Link>
        </div>
      </div>
    </Section>
  );
}
