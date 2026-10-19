import Image from "next/image";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { Container } from "@/components/shared/section";
import { EVENTS, IMAGES, MANAGERS } from "@/lib/mock-data";
import { MOCK_PRICE_CURRENCY } from "@/lib/constants";
import { Price } from "@/components/shared/price";

export function Hero() {
  return (
    <section className="relative pb-16 pt-10 sm:pb-24 sm:pt-16">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Enjoy the music,
            <br />
            <span className="text-grad">own the night.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-fg/70">
            Find concerts, festivals and club nights near you. Pick a seat, pay securely and get your booking code in seconds.
          </p>

          <form action="/events" className="glass mt-8 flex max-w-xl items-center gap-2 rounded-full p-2 pl-5">
            <Search className="size-5 shrink-0 text-fg/55" />
            <input
              name="search"
              aria-label="Search events"
              placeholder="Search artist, event or city"
              className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-fg/45"
            />
            <button className="btn-grad rounded-full px-6 py-3 text-sm font-semibold cursor-pointer">Find events</button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <ul className="flex -space-x-3">
              {MANAGERS.slice(0, 4).map((m) => (
                <li key={m.id} className="relative size-10 overflow-hidden rounded-full ring-2 ring-bg">
                  <Image src={m.image} alt="" fill sizes="40px" className="object-cover" />
                </li>
              ))}
            </ul>
            <p className="text-sm text-fg/65">Join 45,000+ people who booked with us</p>
          </div>
        </div>

        {/* ডানে: phone-style glass card */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div aria-hidden className="absolute -inset-6 rounded-[3rem] bg-linear-to-br from-violet/50 via-magenta/30 to-coral/30 blur-3xl" />
          <div className="glass relative rotate-2 rounded-[2.5rem] p-3">
            <div className="relative aspect-4/5 overflow-hidden rounded-[2rem]">
              <Image src={IMAGES.hero} alt="Crowd cheering at a live concert" fill priority sizes="(min-width:1024px) 480px, 90vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
              <Price amount={EVENTS[0].price} from={MOCK_PRICE_CURRENCY} className="btn-grad absolute right-4 top-4 rounded-full px-4 py-1.5 text-sm font-bold" />
              <div className="glass-img absolute inset-x-3 bottom-3 rounded-3xl p-4">
                <p className="font-bold">{EVENTS[0].title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-fg/70"><MapPin className="size-4" />{EVENTS[0].location}</p>
                <Link href={`/events/${EVENTS[0].id}`} className="btn-grad mt-3 inline-block rounded-full px-5 py-2 text-sm font-semibold">Book now</Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
