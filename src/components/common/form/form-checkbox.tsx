"use client";

import { get, useController, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  /**
   * value দিলে এটা checkbox group এর একটা item হয়: form এ value যায় string[] হিসেবে।
   * value না দিলে একটাই checkbox: form এ value যায় true / false হিসেবে।
   */
  value?: string;
  /** পাশের লেখা (সাধারণ string) */
  label?: string;
  /** পাশের লেখা হিসেবে JSX (Link, bold ইত্যাদি)। children থাকলে label এর চেয়ে এটা প্রাধান্য পায় */
  children?: React.ReactNode;
};

/**
 * 1) একটা checkbox (terms ইত্যাদি), value = true/false
 *    <FormCheckbox name="terms">I agree to the <Link href="/terms">Terms</Link></FormCheckbox>
 *
 * 2) Checkbox group, value = ["music", "sports"]
 *    <FormCheckbox name="hobbies" value="music" label="Music" />
 *    <FormCheckbox name="hobbies" value="sports">Sports <b>(new)</b></FormCheckbox>
 *    <FormError name="hobbies" />   ← group এর error একবার এখানে দেখান
 */
export function FormCheckbox({ name, value, label, children }: Props) {
  const { control, formState: { errors } } = useFormContext();
  const { field: { value: current, onChange, onBlur, ref } } = useController({ name, control });
  const error = get(errors, name)?.message as string | undefined;

  const isGroup = value !== undefined;
  const list: string[] = Array.isArray(current) ? current : [];
  const checked = isGroup ? list.includes(value) : !!current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isGroup) return onChange(e.target.checked);
    onChange(e.target.checked ? [...list.filter((v) => v !== value), value] : list.filter((v) => v !== value));
  };

  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
        <input
          ref={ref}
          id={isGroup ? `${name}-${value}` : name}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          onBlur={onBlur}
          className="mt-0.5 size-5 shrink-0 accent-magenta"
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        <span>{children ?? label}</span>
      </label>
      {/* একটাই checkbox হলে error এখানেই, group এ FormError ব্যবহার করুন */}
      {!isGroup && error && <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
