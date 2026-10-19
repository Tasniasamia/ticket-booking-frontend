"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** ছোট dropdown: বাইরে click বা Esc দিলে বন্ধ হয়। children এ close() পাওয়া যায়। */
export function Dropdown({
  trigger, children, label, align = "right", className,
}: {
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  label: string;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className={cn("focus-visible:outline-2 focus-visible:outline-coral cursor-pointer", className)}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-3 min-w-44 rounded-2xl border border-fg/15 bg-panel/95 p-1.5 shadow-2xl backdrop-blur-xl",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
