import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "@/components/shared/section";
import { IMAGES } from "@/lib/mock-data";
import { LText } from "@/components/shared/localized-text";
import { imageUrl, listOf, section, textOf } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import type { MessageKey } from "@/lib/i18n/messages";

const POINTS: MessageKey[] = ["Verified organisers and managers only", "One booking code per ticket, checked at the gate", "Prices in your own currency and language"];

export function About({ content ,lang}: { content?: PageContent ,lang:string}) {
  const c = section(content, "about");
  // const img1 = imageUrl(c, "image1") || IMAGES.about1;
  // const img2 = imageUrl(c, "image2") || IMAGES.about2;
  // admin কোনো point দিলে সেগুলোই দেখায়, না দিলে আগের তিনটা
  const custom = listOf(c, "points");
  const points: { key: string; value?: unknown; fallback?: MessageKey }[] = custom.length
    ? custom.map((p, i) => ({ key: `c${i}`, value: p }))
    : POINTS.map((p) => ({ key: p, fallback: p }));
  return (
    <Section id="about">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div className="relative mx-auto h-105 w-full max-w-lg sm:h-120">
          <div className="glass absolute left-0 top-0 h-[78%] w-[68%] -rotate-3 rounded-4xl p-2.5">
            <div className="relative size-full overflow-hidden rounded-3xl">
              <Image src={String(c.image1_url)} alt="Singer performing on stage" fill sizes="340px" className="object-cover" />
            </div>
          </div>
          <div className="glass absolute bottom-0 right-0 h-[58%] w-[52%] rotate-3 rounded-4xl p-2.5">
            <div className="relative size-full overflow-hidden rounded-3xl">
              <Image src={String(c.image2_url)} alt="Lights over a festival crowd" fill sizes="280px" className="object-cover" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {textOf(c.title,lang)}
            {/* <LText value={c.title} fallback="We make going out simple" /> */}
            </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-fg/70">
          {textOf(c.description,lang)}
            {/* <LText value={c.description} fallback="TicketBooking connects people with live events and the managers who run them. Browse, compare and book without queues, then message the organiser if you need help." /> */}
          </p>
          <ul className="mt-7 space-y-4">
            {points.map((p) => (
              <li key={p.key} className="flex items-center gap-3">
                <span className="btn-grad grid size-7 shrink-0 place-items-center rounded-full"><Check className="size-4" /></span>
               {textOf(p.value,lang)}
                {/* <LText value={p.value} fallback={p.fallback} /> */}
              </li>
            ))}
          </ul>
          <Link href="/events" className="btn-grad mt-9 inline-block rounded-full px-8 py-3.5 font-semibold"><LText value={c.button} fallback="Browse events" /></Link>
        </div>
      </div>
    </Section>
  );
}
