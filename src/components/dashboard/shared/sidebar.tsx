"use client";

import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { memberSince, type Profile } from "@/features/user/type";

export type MenuItem = {
  key: number;
  label: string;
  link: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

type SidebarProps = {
  user: Profile;
  menu: MenuItem[];
  activeKey: number;
};

const Sidebar = ({ user, menu, activeKey }: SidebarProps) => {
  return (
    <aside className="flex flex-col items-center rounded-3xl border border-fg/15 bg-panel/60 p-6 text-center sm:p-8">
      <UserAvatar
        name={user.name}
        image={user.profile_image}
        sizes="112px"
        className="size-28 text-5xl"
      />

      <h2 className="mt-5 max-w-full truncate text-xl font-bold">{user.name}</h2>

      <p className="mt-1 max-w-full truncate text-sm text-fg/65">{user.email}</p>

      <span className="mt-4 rounded-full bg-fg/10 px-3 py-1 text-xs font-semibold capitalize">
        {user.role}
      </span>

      {user.createdAt && (
        <p className="mt-4 text-xs text-fg/50">
          Member since {memberSince(user.createdAt)}
        </p>
      )}

      <nav className="mt-6 w-full" aria-label="Dashboard menu">
        <ul className="space-y-2">
          {menu.map((item) => {
            const active = item.key === activeKey;
            return (
              <li key={item.key}>
                <Link
                  href={item.link}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-start text-base font-medium hover:bg-fg/10 ${
                    active ? "border-fg/40 bg-fg/10" : ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;