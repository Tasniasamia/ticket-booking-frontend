import {
  BookPlusIcon,
  CalendarDays,
  FolderOpen,
  Globe,
  HelpCircle,
  Languages,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MessageSquareQuote,
  Settings,
  Ticket,
  UserCog,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type AdminMenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  /** থাকলে এই item-এর নিচে submenu দেখাবে */
  children?: AdminMenuItem[];
};

export type AdminMenuGroup = { label?: string; items: AdminMenuItem[] };

export const ADMIN_MENU: AdminMenuGroup[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        title: "Dashboard",
        subtitle: "Sales, events and people across TicketBooking.",
      },
    ],
  },
  {
    label: "Manage",
    items: [
      {
        label: "Events",
        href: "/admin/events",
        icon: CalendarDays,
        title: "Events",
        subtitle: "Review, approve and manage every event on the platform.",
        children: [
          {
            label: "Events",
            href: "/admin/events",
            icon: CalendarDays,
            title: "Events",
            subtitle: "Review, approve and manage every event on the platform.",
          },
          {
            label: "Category",
            href: "/admin/event-category",
            icon: FolderOpen,
            title: "Event Categories",
            subtitle: "Create and manage event categories.",
          },
        ],
      },
      {
        label: "Bookings",
        href: "/admin/bookings",
        icon: Ticket,
        title: "Bookings",
        subtitle: "Track tickets, booking codes and their status.",
      },
      {
        label: "Payments",
        href: "/admin/payments",
        icon: Wallet,
        title: "Payments",
        subtitle: "Payments, refunds and payouts to managers.",
      },
      {
        label: "Messages",
        href: "/admin/messages",
        icon: MessageCircle,
        title: "Messages",
        subtitle: "Chat with any user or manager.",
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
        title: "Users",
        subtitle: "Everyone with an account, with their role and status.",
      },
      {
        label: "Managers",
        href: "/admin/managers",
        icon: UserCog,
        title: "Managers",
        subtitle: "Event managers, their verification and their events.",
      },
      {
        label: "FAQs",
        href: "/admin/faq",
        icon: HelpCircle,
        title: "FAQs",
        subtitle: "Manage frequently asked questions.",
      },
      {
        label: "Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquareQuote,
        title: "Testimonials",
        subtitle: "Customer reviews on the home page.",
      },
      {
        label: "Contacts",
        href: "/admin/contacts",
        icon: Mail,
        title: "Contact messages",
        subtitle: "Public contact form submissions and replies.",
      },
      {
        label: "Subscribers",
        href: "/admin/subscribers",
        icon: Mail,
        title: "Subscribers",
        subtitle: "Newsletter emails from the footer form.",
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Currency",
        href: "/admin/currency",
        icon: Wallet,
        title: "Currency",
        subtitle: "Manage the currency settings for your platform.",
      },
      {
        label: "Languages",
        href: "/admin/languages",
        icon: Globe,
        title: "Languages",
        subtitle: "Manage the languages supported by your platform.",
      },
      {
        label: "Translations",
        href: "/admin/translations",
        icon: Languages,
        title: "Translations",
        subtitle: "Manage the translations for your platform.",
      },
      {
        label: "Payments",
        href: "/admin/payment-methods",
        icon: Wallet,
        title: "Payments",
        subtitle: "Payments, refunds and payouts to managers.",
      },
      {
        label: "Page Settings",
        href: "/admin/page-settings",
        icon: BookPlusIcon,
        title: "Page Settings",
        subtitle: "Manage the settings for your platform's pages.",
      },
      {
        label: "Site Settings",
        href: "/admin/site-settings",
        icon: Settings,
        title: "Site Settings",
        subtitle: "Manage the settings for your platform's site.",
      },
    ],
  },
];

/** children সহ সব item flatten করে */
function flattenItems(items: AdminMenuItem[]): AdminMenuItem[] {
  return items.flatMap((item) =>
    item.children?.length
      ? [item, ...flattenItems(item.children)]
      : [item],
  );
}

export const ADMIN_ITEMS: AdminMenuItem[] = ADMIN_MENU.flatMap((g) =>
  flattenItems(g.items),
);

export function findActiveItem(pathname: string): AdminMenuItem {
  return (
    [...ADMIN_ITEMS]
      .sort((a, b) => b.href.length - a.href.length)
      .find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)) ??
    ADMIN_ITEMS[0]
  );
}