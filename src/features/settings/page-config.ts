export const PAGE_SLUGS = ["home", "about", "contact", "events", "managers", "blog", "faq"] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];

export type FieldKind = "text" | "textarea" | "list" | "image";

export type FieldDef = {
  key: string;
  label: string;
  kind: FieldKind;
  /** site এ এখন যে default লেখা দেখায় (খালি রাখলে এটাই দেখাবে) */
  placeholder?: string;
};

export type SectionDef = { key: string; label: string; fields: FieldDef[] };
export type PageDef = { slug: PageSlug; label: string; description: string; sections: SectionDef[] };

const titleSubtitle = (title: string, subtitle: string, titleLabel = "Title"): FieldDef[] => [
  { key: "title", label: titleLabel, kind: "text", placeholder: title },
  { key: "subtitle", label: "Subtitle", kind: "textarea", placeholder: subtitle },
];

const aboutSection: SectionDef = {
  key: "about",
  label: "About section",
  fields: [
    { key: "title", label: "Title", kind: "text", placeholder: "We make going out simple" },
    {
      key: "description",
      label: "Description",
      kind: "textarea",
      placeholder:
        "TicketBooking connects people with live events and the managers who run them. Browse, compare and book without queues, then message the organiser if you need help.",
    },
    { key: "points", label: "Points", kind: "list" },
    // { key: "button", label: "Button text", kind: "text", placeholder: "Browse events" },
    { key: "image1", label: "Image 1 (big)", kind: "image" },
    { key: "image2", label: "Image 2 (small)", kind: "image" },
  ],
};

export const PAGES: PageDef[] = [
  {
    slug: "home",
    label: "Home",
    description: "Hero, about section and the title/subtitle of every other section on the home page.",
    sections: [
      {
        key: "hero",
        label: "First section (Hero)",
        fields: [
          { key: "title", label: "Title", kind: "text", placeholder: "Enjoy the music," },
          { key: "highlight", label: "Highlighted title", kind: "text", placeholder: "own the night." },
          {
            key: "subtitle",
            label: "Subtitle",
            kind: "textarea",
            placeholder: "Find concerts, festivals and club nights near you. Pick a seat, pay securely and get your booking code in seconds.",
          },
          { key: "image", label: "Hero image", kind: "image" },
        ],
      },
      { ...aboutSection, label: "Second section (About)" },
      { key: "services", label: "Services section", fields: titleSubtitle("Everything you need for the night", "From the first search to the front door, each step is handled in one place.") },
      { key: "events", label: "Trending events section", fields: titleSubtitle("Trending events", "The most booked shows this month. Swipe or use the arrows to see more.") },
      { key: "managers", label: "Managers section", fields: titleSubtitle("Meet the event managers", "The people behind the shows. Open a profile to see their events and ask questions.") },
      { key: "testimonials", label: "Testimonials section", fields: titleSubtitle("What our guests say", "") },
      { key: "contact", label: "Contact section", fields: titleSubtitle("Questions? Talk to us", "We reply within one working day.") },
    ],
  },
  {
    slug: "about",
    label: "About us",
    description: "The hero and the about section of the About page.",
    sections: [
      { key: "hero", label: "First section (Hero)", fields: titleSubtitle("About TicketBooking", "We help people find live events and help organisers fill them.") },
      { ...aboutSection, label: "Second section (About)" },
    ],
  },
  {
    slug: "contact",
    label: "Contact",
    description: "The page hero and the contact section title/subtitle. Email, phone and address come from Site settings.",
    sections: [
      { key: "hero", label: "First section (Hero)", fields: titleSubtitle("Contact us", "Questions about a booking or an event? Send us a message.") },
      { key: "contact", label: "Contact section", fields: titleSubtitle("Questions? Talk to us", "We reply within one working day.") },
    ],
  },
  {
    slug: "events",
    label: "Events",
    description: "Title and subtitle at the top of the Events page.",
    sections: [{ key: "hero", label: "Page title", fields: titleSubtitle("Find your next event", "Search by name or city, or filter by category.") }],
  },
  {
    slug: "managers",
    label: "Managers",
    description: "Title and subtitle at the top of the Managers page.",
    sections: [{ key: "hero", label: "Page title", fields: titleSubtitle("Event managers", "Verified organisers behind the shows. Open a profile to see their events.") }],
  },
  {
    slug: "blog",
    label: "Blog",
    description: "Title and subtitle at the top of the Blog page.",
    sections: [{ key: "hero", label: "Page title", fields: titleSubtitle("Stories and guides", "Tips for getting the most out of every night out.") }],
  },
  {
    slug: "faq",
    label: "FAQ",
    description: "Title and subtitle at the top of the FAQ page.",
    sections: [{ key: "hero", label: "Page title", fields: titleSubtitle("Frequently asked questions", "Quick answers about booking, payments and your account.") }],
  },
];

export const isPageSlug = (v: string): v is PageSlug => (PAGE_SLUGS as readonly string[]).includes(v);
