import Image from "next/image";
import { cn } from "@/lib/utils";

/** ছবি থাকলে ছবি, না থাকলে নামের প্রথম অক্ষর gradient circle এ। */
export function UserAvatar({ name, image, className }: { name: string; image?: string | null; className?: string }) {
  const base = "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-white/25";
  if (image) {
    return (
      <span className={cn(base, className)}>
        <Image src={image} alt={name} fill sizes="48px" className="object-cover" />
      </span>
    );
  }
  return (
    <span
      aria-label={name}
      className={cn(base, "bg-linear-to-br from-violet via-magenta to-coral text-base font-bold text-white", className)}
    >
      {name.trim().charAt(0).toUpperCase() || "U"}
    </span>
  );
}
