// // import {
// //   CalendarDays,
// //   Globe,
// //   Languages,
// //   LayoutDashboard,
// //   Newspaper,
// //   Ticket,
// //   UserCog,
// //   UserRound,
// //   Users,
// //   Wallet,
// //   type LucideIcon,
// // } from "lucide-react";

// // export type AdminMenuItem = {
// //   label: string;
// //   href: string;
// //   icon: LucideIcon;
// //   title: string;
// //   subtitle: string;
// // };

// // export type AdminMenuGroup = { label?: string; items: AdminMenuItem[] };

// // /** নতুন menu item যোগ করতে শুধু এখানে একটা object বসাও, sidebar আর header নিজেই বদলে যাবে। */
// // export const ADMIN_MENU: AdminMenuGroup[] = [
// //   {
// //     items: [
// //       {
// //         label: "Dashboard",
// //         href: "/admin",
// //         icon: LayoutDashboard,
// //         title: "Dashboard",
// //         subtitle: "Sales, events and people across TicketBooking.",
// //       },
// //     ],
// //   },
// //   {
// //     label: "Manage",
// //     items: [
// //       {
// //         label: "Events",
// //         href: "/admin/events",
// //         icon: CalendarDays,
// //         title: "Events",
// //         subtitle: "Review, approve and manage every event on the platform.",
// //       },
// //       {
// //         label: "Bookings",
// //         href: "/admin/bookings",
// //         icon: Ticket,
// //         title: "Bookings",
// //         subtitle: "Track tickets, booking codes and their status.",
// //       },
// //       {
// //         label: "Payments",
// //         href: "/admin/payments",
// //         icon: Wallet,
// //         title: "Payments",
// //         subtitle: "Payments, refunds and payouts to managers.",
// //       },
// //       {
// //         label: "Users",
// //         href: "/admin/users",
// //         icon: Users,
// //         title: "Users",
// //         subtitle: "Everyone with an account, with their role and status.",
// //       },
// //       {
// //         label: "Managers",
// //         href: "/admin/managers",
// //         icon: UserCog,
// //         title: "Managers",
// //         subtitle: "Event managers, their verification and their events.",
// //       },
// //     ],
// //   },
// //   {
// //     label: "Content",
// //     items: [
// //       {
// //         label: "Blog",
// //         href: "/admin/blog",
// //         icon: Newspaper,
// //         title: "Blog",
// //         subtitle: "Write and publish posts for the public blog.",
// //       },
// //     ],
// //   },
// //    {
// //     label: "Settings",
// //     items: [
// //       {
// //         label: "Currency",
// //         href: "/admin/currency",
// //         icon: Wallet,
// //         title: "Currency",
// //         subtitle: "Manage the default currency for your platform.",
// //       },
// //       {
// //         label: "Languages",
// //         href: "/admin/languages",
// //         icon: Globe,
// //         title: "Languages",
// //         subtitle: "Add languages and choose the site default.",
// //       },
// //       {
// //         label: "Translations",
// //         href: "/admin/translations",
// //         icon: Languages,
// //         title: "Translations",
// //         subtitle: "Edit every text on the site for each language.",
// //       },
// //     ],
// //   },
// //   {
// //     label: "Account",
// //     items: [
// //       {
// //         label: "Profile",
// //         href: "/admin/profile",
// //         icon: UserRound,
// //         title: "My profile",
// //         subtitle: "Your account details. Keep them up to date.",
// //       },
// //     ],
// //   },
// // ];

// // export const ADMIN_ITEMS: AdminMenuItem[] = ADMIN_MENU.flatMap((g) => g.items);

// // /** বর্তমান URL এর সাথে মেলে এমন item (লম্বা href আগে দেখা হয়, তাই /admin সবসময় জেতে না)। */
// // export function findActiveItem(pathname: string): AdminMenuItem {
// //   return (
// //     [...ADMIN_ITEMS]
// //       .sort((a, b) => b.href.length - a.href.length)
// //       .find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)) ??
// //     ADMIN_ITEMS[0]
// //   );
// // }
// import {
//   CalendarDays,
//   FolderOpen,
//   Globe,
//   Languages,
//   LayoutDashboard,
//   Newspaper,
//   Ticket,
//   UserCog,
//   UserRound,
//   Users,
//   Wallet,
//   type LucideIcon,
// } from "lucide-react";

// export type AdminMenuItem = {
//   label: string;
//   href: string;
//   icon: LucideIcon;
//   title: string;
//   subtitle: string;
//   /** থাকলে এই item-এর নিচে submenu দেখাবে */
//   children?: AdminMenuItem[];
// };

// export type AdminMenuGroup = { label?: string; items: AdminMenuItem[] };

// export const ADMIN_MENU: AdminMenuGroup[] = [
//   {
//     items: [
//       {
//         label: "Dashboard",
//         href: "/admin",
//         icon: LayoutDashboard,
//         title: "Dashboard",
//         subtitle: "Sales, events and people across TicketBooking.",
//       },
//     ],
//   },
//   {
//     label: "Manage",
//     items: [
//       {
//         label: "Events",
//         href: "/admin/events",
//         icon: CalendarDays,
//         title: "Events",
//         subtitle: "Review, approve and manage every event on the platform.",
//         children: [
//           {
//             label: "All Events",
//             href: "/admin/events",
//             icon: CalendarDays,
//             title: "Events",
//             subtitle: "Review, approve and manage every event on the platform.",
//           },
//           {
//             label: "Event Categories",
//             href: "/admin/event-category",
//             icon: FolderOpen,
//             title: "Event Categories",
//             subtitle: "Create and manage event categories.",
//           },
//         ],
//       },
//       {
//         label: "Blog",
//         href: "/admin/blog",
//         icon: Newspaper,
//         title: "Blog",
//         subtitle: "Manage blog posts and settings.",
//       },
//       // Bookings, Payments, Users, Managers — আগের মতোই
//       {
//         label: "Bookings",
//         href: "/admin/bookings",
//         icon: Ticket,
//         title: "Bookings",
//         subtitle: "Track tickets, booking codes and their status.",
//       },
//       {
//         label: "Payments",
//         href: "/admin/payments",
//         icon: Wallet,
//         title: "Payments",
//         subtitle: "Payments, refunds and payouts to managers.",
//       },
//       {
//         label: "Users",
//         href: "/admin/users",
//         icon: Users,
//         title: "Users",
//         subtitle: "Everyone with an account, with their role and status.",
//       },
//       {
//         label: "Managers",
//         href: "/admin/managers",
//         icon: UserCog,
//         title: "Managers",
//         subtitle: "Event managers, their verification and their events.",
//       },
//     ],
//   },
//   {
//     label: "Settings",
//     items: [
//       {
//         label: "Currency",
//         href: "/admin/currency",
//         icon: Wallet,
//         title: "Currency",
//         subtitle: "Manage the currency settings for your platform.",
//       },
//       {
//         label: "Languages",
//         href: "/admin/languages",
//         icon: Languages,
//         title: "Languages",
//         subtitle: "Manage the languages supported by your platform.",
//       },
//       {
//         label: "Translations",
//         href: "/admin/translations",
//         icon: Languages,
//         title: "Translations",
//         subtitle: "Manage the translations for your platform.",
//       },

//       {
//         label: "Payments",
//         href: "/admin/payment-methods",
//         icon: Wallet,
//         title: "Payments",
//         subtitle: "Payments, refunds and payouts to managers.",
//       },
//       {
//         label: "Page Settings",
//         href: "/admin/page-settings",
//         icon: Globe,
//         title: "Page Settings",
//         subtitle: "Manage the settings for your platform's pages.",
//       },
//       {
//         label: "Site Settings",
//         href: "/admin/site-settings",
//         icon: Globe,
//         title: "Site Settings",
//         subtitle: "Manage the settings for your platform's site.",
//       },
//     ],
//   },
//   // ...
// ];

// /** children সহ সব item flatten করে */
// function flattenItems(items: AdminMenuItem[]): AdminMenuItem[] {
//   return items.flatMap((item) =>
//     item.children?.length ? [item, ...flattenItems(item.children)] : [item],
//   );
// }

// export const ADMIN_ITEMS: AdminMenuItem[] = ADMIN_MENU.flatMap((g) =>
//   flattenItems(g.items),
// );

// export function findActiveItem(pathname: string): AdminMenuItem {
//   return (
//     [...ADMIN_ITEMS]
//       .sort((a, b) => b.href.length - a.href.length)
//       .find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)) ??
//     ADMIN_ITEMS[0]
//   );
// }


// import {
//   CalendarDays,
//   Globe,
//   Languages,
//   LayoutDashboard,
//   Newspaper,
//   Ticket,
//   UserCog,
//   UserRound,
//   Users,
//   Wallet,
//   type LucideIcon,
//, MessageCircle } from "lucide-react";

// export type AdminMenuItem = {
//   label: string;
//   href: string;
//   icon: LucideIcon;
//   title: string;
//   subtitle: string;
// };

// export type AdminMenuGroup = { label?: string; items: AdminMenuItem[] };

// /** নতুন menu item যোগ করতে শুধু এখানে একটা object বসাও, sidebar আর header নিজেই বদলে যাবে। */
// export const ADMIN_MENU: AdminMenuGroup[] = [
//   {
//     items: [
//       {
//         label: "Dashboard",
//         href: "/admin",
//         icon: LayoutDashboard,
//         title: "Dashboard",
//         subtitle: "Sales, events and people across TicketBooking.",
//       },
//     ],
//   },
//   {
//     label: "Manage",
//     items: [
//       {
//         label: "Events",
//         href: "/admin/events",
//         icon: CalendarDays,
//         title: "Events",
//         subtitle: "Review, approve and manage every event on the platform.",
//       },
//       {
//         label: "Bookings",
//         href: "/admin/bookings",
//         icon: Ticket,
//         title: "Bookings",
//         subtitle: "Track tickets, booking codes and their status.",
//       },
//       {
//         label: "Payments",
//         href: "/admin/payments",
//         icon: Wallet,
//         title: "Payments",
//         subtitle: "Payments, refunds and payouts to managers.",
//       },
//       {
//         label: "Users",
//         href: "/admin/users",
//         icon: Users,
//         title: "Users",
//         subtitle: "Everyone with an account, with their role and status.",
//       },
//       {
//         label: "Managers",
//         href: "/admin/managers",
//         icon: UserCog,
//         title: "Managers",
//         subtitle: "Event managers, their verification and their events.",
//       },
//     ],
//   },
//   {
//     label: "Content",
//     items: [
//       {
//         label: "Blog",
//         href: "/admin/blog",
//         icon: Newspaper,
//         title: "Blog",
//         subtitle: "Write and publish posts for the public blog.",
//       },
//     ],
//   },
//    {
//     label: "Settings",
//     items: [
//       {
//         label: "Currency",
//         href: "/admin/currency",
//         icon: Wallet,
//         title: "Currency",
//         subtitle: "Manage the default currency for your platform.",
//       },
//       {
//         label: "Languages",
//         href: "/admin/languages",
//         icon: Globe,
//         title: "Languages",
//         subtitle: "Add languages and choose the site default.",
//       },
//       {
//         label: "Translations",
//         href: "/admin/translations",
//         icon: Languages,
//         title: "Translations",
//         subtitle: "Edit every text on the site for each language.",
//       },
//     ],
//   },
//   {
//     label: "Account",
//     items: [
//       {
//         label: "Profile",
//         href: "/admin/profile",
//         icon: UserRound,
//         title: "My profile",
//         subtitle: "Your account details. Keep them up to date.",
//       },
//     ],
//   },
// ];

// export const ADMIN_ITEMS: AdminMenuItem[] = ADMIN_MENU.flatMap((g) => g.items);

// /** বর্তমান URL এর সাথে মেলে এমন item (লম্বা href আগে দেখা হয়, তাই /admin সবসময় জেতে না)। */
// export function findActiveItem(pathname: string): AdminMenuItem {
//   return (
//     [...ADMIN_ITEMS]
//       .sort((a, b) => b.href.length - a.href.length)
//       .find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)) ??
//     ADMIN_ITEMS[0]
//   );
// }
import {
  BookPlusIcon,
  CalendarDays,
  FolderOpen,
  Globe,
  Languages,
  LayoutDashboard,
  MessageCircle,
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
            label: "All Events",
            href: "/admin/events",
            icon: CalendarDays,
            title: "Events",
            subtitle: "Review, approve and manage every event on the platform.",
          },
          {
            label: "Event Categories",
            href: "/admin/event-category",
            icon: FolderOpen,
            title: "Event Categories",
            subtitle: "Create and manage event categories.",
          },
        ],
      },
      // Bookings, Payments, Users, Managers — আগের মতোই
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
        icon:  BookPlusIcon,
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
  // ...
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