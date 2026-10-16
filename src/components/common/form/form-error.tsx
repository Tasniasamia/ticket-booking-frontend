"use client";

import { get, useFormContext } from "react-hook-form";

/**
 * কোনো field এর error আলাদা জায়গায় দেখাতে।
 * Checkbox/Radio group এ প্রতিটা item এর নিচে না দেখিয়ে group এর শেষে একবার বসান।
 */
export function FormError({ name }: { name: string }) {
  const { formState: { errors } } = useFormContext();
  const error = get(errors, name)?.message as string | undefined;
  if (!error) return null;
  return <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm text-red-500">{error}</p>;
}
