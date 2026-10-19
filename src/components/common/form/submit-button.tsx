"use client";

import { useFormState } from "react-hook-form";
import { cn } from "@/lib/utils";

/** Submit এর সময় নিজে থেকেই disable হয় আর loadingText দেখায়। */
export function SubmitButton({ children, loadingText, className }: { children: React.ReactNode; loadingText?: string; className?: string }) {
  const { isSubmitting } = useFormState();
  return (
    <button type="submit" disabled={isSubmitting} className={cn("btn-grad cursor-pointer w-full rounded-full py-3.5 font-semibold disabled:opacity-60", className)}>
      {isSubmitting ? (loadingText ?? children) : children}
    </button>
  );
}
