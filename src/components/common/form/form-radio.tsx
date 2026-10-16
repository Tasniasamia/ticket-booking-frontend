"use client";

import { useFormContext } from "react-hook-form";

type Props = {
  /** field এর নাম। একই group এর সব radio তে একই name দিন */
  name: string;
  /** এই radio বাছলে form এ যে value যাবে */
  value: string;
  /** পাশের লেখা (সাধারণ string) */
  label?: string;
  /** পাশের লেখা হিসেবে JSX (Link, bold ইত্যাদি)। children থাকলে label এর চেয়ে এটা প্রাধান্য পায় */
  children?: React.ReactNode;
};

/**
 * একটা radio button। Group বানাতে একই name দিয়ে একাধিকবার ব্যবহার করুন:
 *   <FormRadio name="role" value="user" label="User" />
 *   <FormRadio name="role" value="manager">Manager <b>(host events)</b></FormRadio>
 *   <FormError name="role" />   ← দরকার হলে group এর error একবার এখানে দেখান
 */
export function FormRadio({ name, value, label, children }: Props) {
  const { register } = useFormContext();
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input id={`${name}-${value}`} type="radio" value={value} className="size-4.5 shrink-0 accent-magenta" {...register(name)} />
      <span>{children ?? label}</span>
    </label>
  );
}
