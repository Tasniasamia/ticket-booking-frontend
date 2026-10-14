"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-2xl border border-fg/15 bg-fg/5 px-4 py-3 outline-none transition placeholder:text-fg/40 focus:border-coral aria-invalid:border-red-500";

/** Label + error message wrapper। error থাকলে role="alert" দিয়ে screen reader কে জানায়। */
export function Field({
  label, htmlFor, error, children,
}: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold">{label}</label>
      {children}
      {error && <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

/** Eye icon দিয়ে password দেখানো/লুকানো। RHF এর register() সরাসরি spread করা যায়। */
export function PasswordInput({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={show ? "text" : "password"} className={cn(inputClass, "pr-12", className)} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-fg/60 hover:text-fg focus-visible:outline-2 focus-visible:outline-coral"
      >
        {show ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
      </button>
    </div>
  );
}

export function FormAlert({ message }: { message?: string }) {
  if (!message) return null;
  return <p role="alert" className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">{message}</p>;
}
