"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { get, useController, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormField } from "./form-field";
import { inputClass } from "./styles";

export type SelectOption = { value: string; label: string };

type Props = {
  name: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  disabled?: boolean;
};

/**
 * Custom select (browser এর default select না)।
 * - Mouse: click করে খুলুন, option বাছুন, বাইরে click করলে বন্ধ
 * - Keyboard: ↑ ↓ Home End দিয়ে ঘোরা, Enter/Space দিয়ে বাছা, Esc দিয়ে বন্ধ
 */
export function FormSelect({ name, label, options, placeholder = "Select an option", disabled }: Props) {
  const { control, formState: { errors } } = useFormContext();
  const { field: { value, onChange, onBlur, ref } } = useController({ name, control });
  const error = get(errors, name)?.message as string | undefined;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); openList(); }
      return;
    }
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setActive((i) => Math.min(i + 1, options.length - 1)); break;
      case "ArrowUp": e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); break;
      case "Home": e.preventDefault(); setActive(0); break;
      case "End": e.preventDefault(); setActive(options.length - 1); break;
      case "Enter":
      case " ": e.preventDefault(); choose(options[active].value); break;
      case "Escape": e.preventDefault(); setOpen(false); break;
      case "Tab": setOpen(false); break;
    }
  };

  return (
    <FormField label={label} htmlFor={name} error={error}>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          id={name}
          ref={ref}
          disabled={disabled}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          className={cn(inputClass, "flex items-center cursor-pointer justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-60")}
        >
          <span className={cn("truncate", !selected && "text-fg/40")}>{selected?.label ?? placeholder}</span>
          <ChevronDown className={cn("size-4.5 shrink-0 text-fg/60 transition", open && "rotate-180")} />
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={name}
            className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-fg/15 bg-panel/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            {options.map((o, i) => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o.value)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm",
                  i === active && "bg-fg/10",
                  o.value === value && "font-semibold",
                )}
              >
                {o.label}
                {o.value === value && <Check className="size-4 text-coral" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormField>
  );
}
