import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { EventsSlider } from "@/components/home/events-slider";
import { Hero } from "@/components/home/hero";
import { ManagersSlider } from "@/components/home/managers-slider";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <EventsSlider />
      <ManagersSlider />
      <Testimonials />
      <Contact />
    </>
  );
}
