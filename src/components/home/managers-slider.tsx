import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { Section, SectionHeading } from "@/components/shared/section";
import { MANAGERS } from "@/lib/mock-data";

export function ManagersSlider() {
  return (
    <Section id="managers">
      <SectionHeading title="Meet the event managers" subtitle="The people behind the shows. Open a profile to see their events and ask questions." />
      <Carousel label="managers">
        {MANAGERS.map((m) => (
          <CarouselItem key={m.id} className="xl:basis-[23.5%]">
            <article className="group relative aspect-3/4 overflow-hidden rounded-4xl">
              <Image src={m.image} alt={m.name} fill sizes="(min-width:1280px) 24vw, (min-width:640px) 45vw, 80vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
              <span className="glass absolute right-3 top-3 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"><Star className="size-3.5 fill-coral text-coral" />{m.rating}</span>
              <div className="glass absolute inset-x-3 bottom-3 rounded-3xl p-4">
                <h3 className="font-bold">{m.name}</h3>
                <p className="text-sm text-white/65">{m.org} · {m.events} events</p>
                <Link href={`/managers/${m.id}`} className="btn-grad mt-3 block rounded-full py-2.5 text-center text-sm font-semibold">View details</Link>
              </div>
            </article>
          </CarouselItem>
        ))}
      </Carousel>
    </Section>
  );
}
