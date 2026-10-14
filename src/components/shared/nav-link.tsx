"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** বর্তমান page এর link চিনে activeClassName বসায় আর aria-current দেয়। #anchor link কখনো active হয় না। */
export function NavLink({
  href, className, activeClassName, onClick, children,
}: {
  href: string; className?: string; activeClassName?: string; onClick?: () => void; children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = !href.includes("#") && (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  return (
    <Link href={href} onClick={onClick} aria-current={active ? "page" : undefined} className={cn(className, active && activeClassName)}>
      {children}
    </Link>
  );
}
