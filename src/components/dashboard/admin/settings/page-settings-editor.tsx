"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useFormContext, type FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
// import { FormFieldList, FormLocalized, SubmitButton, type LangOption } from "@/components/common/form";
import { FormImageUploader } from "@/components/common/form/form-image-uploader";
import { savePageSettingAction } from "@/features/settings/actions";
import { PAGES, type FieldDef, type PageDef, type PageSlug, type SectionDef } from "@/features/settings/page-config";
import type { PageContent } from "@/features/settings/types";
import { cn } from "@/lib/utils";
import { FormLocalized, LangOption } from "@/components/common/form/form-localized";
import { FormFieldList } from "@/components/common/form/form-field-list";
import { SubmitButton } from "@/components/common/form";

const FALLBACK_LANGS: LangOption[] = [{ code: "en", name: "English" }, { code: "bn", name: "বাংলা" }];
const card = "space-y-5 rounded-3xl border border-fg/15 bg-panel/40 p-5 sm:p-6";

// ---------- saved content ⇄ form values ----------

const asRecord = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

/** { en, bn, ... } : active ভাষাগুলো সবসময় থাকে; আগে save হওয়া অন্য ভাষার লেখাও হারায় না। */
function toLocalized(v: unknown, langs: LangOption[]): Record<string, string> {
  const o = asRecord(v);
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(o)) if (typeof val === "string") out[k] = val;
  for (const l of langs) out[l.code] = typeof o[l.code] === "string" ? (o[l.code] as string) : "";
  return out;
}

function buildDefaults(def: PageDef, content: PageContent, langs: LangOption[]): FieldValues {
  const values: FieldValues = {};
  for (const s of def.sections) {
    const saved = asRecord(content[s.key]);
    const sec: Record<string, unknown> = {};
    for (const f of s.fields) {
      if (f.kind === "image") {
        sec[`${f.key}_url`] = typeof saved[`${f.key}_url`] === "string" ? saved[`${f.key}_url`] : "";
        sec[`${f.key}_id`] = Number(saved[`${f.key}_id`] ?? 0) || 0;
      } else if (f.kind === "list") {
        sec[f.key] = (Array.isArray(saved[f.key]) ? (saved[f.key] as unknown[]) : []).map((row) => toLocalized(row, langs));
      } else {
        sec[f.key] = toLocalized(saved[f.key], langs);
      }
    }
    values[s.key] = sec;
  }
  return values;
}

/** Save এর আগে: একেবারে খালি list row বাদ দিই */
function cleanForSave(def: PageDef, values: FieldValues): FieldValues {
  const out: FieldValues = { ...values };
  for (const s of def.sections) {
    const sec = { ...asRecord(out[s.key]) };
    for (const f of s.fields) {
      if (f.kind !== "list") continue;
      sec[f.key] = (Array.isArray(sec[f.key]) ? (sec[f.key] as Record<string, string>[]) : []).filter((row) => Object.values(row).some((x) => String(x ?? "").trim() !== ""));
    }
    out[s.key] = sec;
  }
  return out;
}

// ---------- fields ----------

function ImageField({ sectionKey, field }: { sectionKey: string; field: FieldDef }) {
  const { watch, setValue } = useFormContext();
  const urlName = `${sectionKey}.${field.key}_url`;
  const idName = `${sectionKey}.${field.key}_id`;
  const url = watch(urlName) as string;
  const id = watch(idName) as number;
  return (
    <FormImageUploader
      name={urlName}
      label={field.label}
      modelName="banner"
      mediaId={id || null}
      defaultPreviewUrl={url || null}
      aspect="4/3"
      size="md"
      onUploadSuccess={(media) => {
        setValue(idName, media.id, { shouldDirty: true });
        setValue(urlName, media.public_url, { shouldDirty: true });
      }}
      onUploadError={(message: string) => toast.error(message || "Failed to upload image.")}
      onRemove={() => {
        setValue(idName, 0, { shouldDirty: true });
        setValue(urlName, "", { shouldDirty: true });
        toast.info("Image removed. Press Save to apply.");
      }}
    />
  );
}

function Field({ section, field, languages }: { section: SectionDef; field: FieldDef; languages: LangOption[] }) {
  const name = `${section.key}.${field.key}`;
  switch (field.kind) {
    case "image":
      return <ImageField sectionKey={section.key} field={field} />;
    case "list":
      return (
        <FormFieldList
          name={name}
          label={field.label}
          columns={languages.map((l) => ({ name: l.code, placeholder: l.name }))}
          addLabel="+ Add Point"
        />
      );
    default:
      return (
        <FormLocalized
          name={name}
          label={field.label}
          languages={languages}
          multiline={field.kind === "textarea"}
          placeholder={field.placeholder}
        />
      );
  }
}

// ---------- one page ----------

function PageForm({ def, content, languages }: { def: PageDef; content: PageContent; languages: LangOption[] }) {
  const router = useRouter();
  const form = useForm<FieldValues>({ defaultValues: buildDefaults(def, content, languages) });

  const onSubmit = async (values: FieldValues) => {
    try {
      const res = await savePageSettingAction(def.slug, cleanForSave(def, values));
      if (res.success) {
        toast.success(res.message ?? "Saved.");
        router.refresh(); // tab এ ফিরলে সর্বশেষ data দেখাবে
      } else toast.error(res.message ?? "Could not save.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
        <p className="text-sm text-fg/60">{def.description} Leave a field empty to keep the default text.</p>
        {def.sections.map((s) => (
          <section key={s.key} className={card}>
            <h2 className="text-lg font-bold">{s.label}</h2>
            {s.fields.map((f) => (
              <Field key={f.key} section={s} field={f} languages={languages} />
            ))}
          </section>
        ))}
        <SubmitButton loadingText="Saving..." className="sm:w-auto sm:px-12">Save {def.label} page</SubmitButton>
      </form>
    </FormProvider>
  );
}

// ---------- tabs ----------

export function PageSettingsEditor({ pages, languages }: { pages: Record<PageSlug, PageContent>; languages: LangOption[] }) {
  const [active, setActive] = useState<PageSlug>("home");
  const langs = languages.length ? languages : FALLBACK_LANGS;
  const def = PAGES.find((p) => p.slug === active)!;

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Pages" className="flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button
            key={p.slug}
            role="tab"
            type="button"
            aria-selected={active === p.slug}
            onClick={() => setActive(p.slug)}
            className={cn(
              "cursor-pointer rounded-full border px-5 py-2 text-sm font-semibold transition",
              active === p.slug ? "btn-grad border-transparent" : "border-fg/15 bg-fg/5 hover:bg-fg/10",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      {/* key: tab বদলালে form নতুন করে শুরু হয় */}
      <PageForm key={active} def={def} content={pages[active]} languages={langs} />
    </div>
  );
}
