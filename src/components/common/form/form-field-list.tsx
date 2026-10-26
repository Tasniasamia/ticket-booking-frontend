"use client";

import { get, useFieldArray, useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "./styles";

export type FieldListColumn = { name: string; placeholder: string };

type Props = {
  /** array field এর নাম, যেমন "credentials" বা "social_media_link" */
  name: string;
  label: string;
  /** প্রতিটা row তে কোন কোন input থাকবে (প্রথমটা key, দ্বিতীয়টা value এই ধরনের) */
  columns: FieldListColumn[];
  addLabel?: string;
  /** কমপক্ষে এতগুলো row রাখতেই হবে (remove button লুকায়) */
  minRows?: number;
  /** inline: label বাঁয়ে (বড় form এ); stacked: label উপরে (ছোট dialog এ) */
  layout?: "inline" | "stacked";
  className?: string;
};

/**
 * Repeatable row list: [input] [input] [X] এবং নিচে dashed "+ Add" button।
 * Credentials (key / value), social links (name / link), বা language অনুযায়ী লেখার list সবেতে একই component।
 * Form এ value যায় object এর array হিসেবে: [{ [columns[0].name]: "...", [columns[1].name]: "..." }]
 */
export function FormFieldList({ name, label, columns, addLabel = "+ Add Item", minRows = 0, layout = "inline", className }: Props) {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  type FieldErr = { message?: string; root?: { message?: string } } | undefined;
  const arrayError = get(errors, name) as FieldErr;
  const rootMessage = arrayError?.root?.message ?? arrayError?.message;

  const blank = () => Object.fromEntries(columns.map((c) => [c.name, ""]));

  return (
    <div className={cn("grid gap-3", layout === "inline" && "sm:grid-cols-[7.5rem_1fr] sm:items-start", className)}>
      <span className={cn("text-sm font-semibold", layout === "inline" && "sm:pt-3 sm:text-right")}>{label}{layout === "inline" ? " :" : ""}</span>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="grid min-w-0 flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
              {columns.map((c) => {
                const path = `${name}.${index}.${c.name}`;
                const err = (get(errors, path) as FieldErr)?.message;
                return (
                  <div key={c.name} className="min-w-0">
                    <input
                      placeholder={c.placeholder}
                      aria-label={`${label} ${index + 1} ${c.placeholder}`}
                      aria-invalid={!!err}
                      className={inputClass}
                      {...register(path)}
                    />
                    {err && <p role="alert" className="mt-1 text-xs text-red-500">{err}</p>}
                  </div>
                );
              })}
            </div>
            {fields.length > minRows && (
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove ${label} ${index + 1}`}
                className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-fg/60 transition hover:bg-red-500/15 hover:text-red-500"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append(blank())}
          className="w-full cursor-pointer rounded-2xl border border-dashed border-fg/25 bg-fg/5 px-4 py-3 text-sm font-medium transition hover:border-coral hover:text-coral"
        >
          <Plus className="mr-1 inline size-4" />
          {addLabel.replace(/^\+\s*/, "")}
        </button>

        {rootMessage && <p role="alert" className="text-sm text-red-500">{rootMessage}</p>}
      </div>
    </div>
  );
}
