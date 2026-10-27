import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/shared/section";
import { EVENTS, IMAGES, MANAGERS } from "@/lib/mock-data";
import { MOCK_PRICE_CURRENCY } from "@/lib/constants";
import { Price } from "@/components/shared/price";
import { T } from "@/components/shared/t";
import { LText } from "@/components/shared/localized-text";
import { imageUrl, section, textOf } from "@/lib/localized";
import type { PageContent } from "@/features/settings/types";
import { HeroSearch } from "./hero-search";
import { EventItem } from "@/features/event/types";




export function Hero({content,lang,event}: { content?: PageContent, lang:string, event?: EventItem }) {
  console.log("event ", event);
  const c = section(content, "hero");
  return (
    <section className="relative pb-16 pt-10 sm:pb-24 sm:pt-16">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
             {textOf(c.title,lang)}
            {/* <LText value={c.title} fallback="Enjoy the music," /> */}
            <br />
            <span className="text-grad">   {textOf(c.highlight,lang)}</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-fg/70">
          {textOf(c.subtitle,lang)}
            {/* <LText value={c.subtitle} fallback="Find concerts, festivals and club nights near you. Pick a seat, pay securely and get your booking code in seconds." /> */}
          </p>

          <HeroSearch />


           
           {/*static start after rendering managers it will dynamically update*/}
          <div className="mt-8 flex items-center gap-4">
            <ul className="flex -space-x-3">
              {MANAGERS.slice(0, 4).map((m) => (
                <li key={m.id} className="relative size-10 overflow-hidden rounded-full ring-2 ring-bg">
                  <Image src={m.image} alt="" fill sizes="40px" className="object-cover" />
                </li>
              ))}
            </ul>
            <p className="text-sm text-fg/65"><T k="Join 45,000+ people who booked with us" /></p>
          </div>
        </div>
           {/*static end*/}




        {/* ডানে: phone-style glass card */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div aria-hidden className="absolute -inset-6 rounded-[3rem] bg-linear-to-br from-violet/50 via-magenta/30 to-coral/30 blur-3xl" />
          <div className="glass relative rotate-2 rounded-[2.5rem] p-3">
            <div className="relative aspect-4/5 overflow-hidden rounded-[2rem]">
              <Image src={String(event?.thumbnail?.url || c.image_url)} alt="Crowd cheering at a live concert" fill priority sizes="(min-width:1024px) 480px, 90vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
              <Price amount={Number(event?.price) || 0} from={MOCK_PRICE_CURRENCY} className="btn-grad absolute right-4 top-4 rounded-full px-4 py-1.5 text-sm font-bold" />
              <div className="glass-img absolute inset-x-3 bottom-3 rounded-3xl p-4">
                <p className="font-bold"> {textOf(event?.title,lang)}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-fg/70"><MapPin className="size-4" />{textOf(event?.location,lang)}</p>
                <Link href={`/events/${event?.id}`} className="btn-grad mt-3 inline-block rounded-full px-5 py-2 text-sm font-semibold"><T k="Book now" /></Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
