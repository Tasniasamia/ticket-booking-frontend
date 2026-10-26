"use client";

import { FormInput } from "./form-input";
import { FormTextarea } from "./form-textarea";

export type LangOption = { code: string; name: string };

type Props = {
  /** যেমন "hero.title"; প্রতিটা ভাষার value যায় "hero.title.<code>" এ */
  name: string;
  label: string;
  languages: LangOption[];
  multiline?: boolean;
  /** খালি থাকলে site এ যে default লেখা দেখায়, সেটা English field এ placeholder হিসেবে */
  placeholder?: string;
  rows?: number;
};

/** একটা লেখা, প্রতিটা active ভাষার জন্য আলাদা input। ভাষা backend এর Languages module থেকে আসে। */
export function FormLocalized({ name, label, languages, multiline, placeholder, rows = 3 }: Props) {
  return (
    <div className="space-y-3">
      {languages.map((l) => {
        const common = {
          name: `${name}.${l.code}`,
          label: `${label} (${l.name})`,
          placeholder: l.code === "en" ? placeholder : undefined,
        };
        return multiline ? <FormTextarea key={l.code} rows={rows} {...common} /> : <FormInput key={l.code} {...common} />;
      })}
    </div>
  );
}
