"use client";

import { useEffect, useState } from "react";

/** সেকেন্ড গুনে নামে। Resend বাটনের অপেক্ষার সময়ের জন্য। */
export function useCooldown(initial = 0) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return [left, setLeft] as const;
}
