"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/** CSS দিয়ে icon বদলায়, তাই hydration mismatch হয় না। */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark and light mode"
      className="glass grid size-10 place-items-center rounded-full transition hover:bg-fg/10 focus-visible:outline-2 focus-visible:outline-coral"
    >
      <Sun className="hidden size-4.5 dark:block" />
      <Moon className="size-4.5 dark:hidden" />
    </button>
  );
}
