"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
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
import {
  deleteRemovedMedia,
  revokePendingImages,
  savedIds,
  toImageItem,
  withUploadSession,
  type ImageItem,
  type SavedImage,
} from "@/features/media/deferred";

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
        // Form এ ছবি একটা item ({ id, url, file? })। Save এর সময় আবার _url/_id তে ভাগ হয়।
        const url = typeof saved[`${f.key}_url`] === "string" ? (saved[`${f.key}_url`] as string) : "";
        sec[imageKey(f.key)] = toImageItem(url, Number(saved[`${f.key}_id`] ?? 0) || 0);
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

/** Form এর ভিতরে ছবির field এর নাম: image1 → image1_image (backend এ যায় image1_url + image1_id) */
const imageKey = (fieldKey: string) => `${fieldKey}_image`;
const refKey = (sectionKey: string, fieldKey: string) => `${sectionKey}.${fieldKey}`;

type ImageRef = { ref: string; section: string; key: string; item: ImageItem };

/** Form এ এখন যে ছবিগুলো আছে (server এর + নতুন select করা, upload বাকি) */
function imageRefs(def: PageDef, values: FieldValues): ImageRef[] {
  const out: ImageRef[] = [];
  for (const s of def.sections) {
    for (const f of s.fields) {
      if (f.kind !== "image") continue;
      const item = asRecord(values[s.key])[imageKey(f.key)] as ImageItem | null | undefined;
      if (item) out.push({ ref: refKey(s.key, f.key), section: s.key, key: f.key, item });
    }
  }
  return out;
}

/** Save হওয়া content এ থাকা ছবির id গুলো (Save সফল হলে যেগুলো আর নেই সেগুলো মুছব) */
function savedImageIds(def: PageDef, content: PageContent): number[] {
  const ids: { id: number }[] = [];
  for (const s of def.sections) {
    const saved = asRecord(content[s.key]);
    for (const f of s.fields) if (f.kind === "image") ids.push({ id: Number(saved[`${f.key}_id`] ?? 0) || 0 });
  }
  return savedIds(ids);
}

/**
 * Save এর আগে: একেবারে খালি list row বাদ দিই, আর ছবি (upload হয়ে যাওয়া) ভেঙে
 * backend এর shape এ (`image1_url`, `image1_id`) বসাই। ছবি না থাকলে "" আর 0।
 */
function cleanForSave(def: PageDef, values: FieldValues, images: Record<string, SavedImage>): FieldValues {
  const out: FieldValues = { ...values };
  for (const s of def.sections) {
    const sec = { ...asRecord(out[s.key]) };
    for (const f of s.fields) {
      if (f.kind === "list") {
        sec[f.key] = (Array.isArray(sec[f.key]) ? (sec[f.key] as Record<string, string>[]) : []).filter((row) => Object.values(row).some((x) => String(x ?? "").trim() !== ""));
      } else if (f.kind === "image") {
        const img = images[refKey(s.key, f.key)];
        delete sec[imageKey(f.key)]; // form এর নিজস্ব key, backend এ যাবে না
        sec[`${f.key}_url`] = img?.url ?? "";
        sec[`${f.key}_id`] = img?.id ?? 0;
      }
    }
    out[s.key] = sec;
  }
  return out;
}

/** Save সফল হলে form এ upload হওয়া ছবি বসাই (pending file সরে যায়, পরের Save এ আবার upload হয় না) */
function withSavedImages(def: PageDef, values: FieldValues, images: Record<string, SavedImage>): FieldValues {
  const out: FieldValues = { ...values };
  for (const s of def.sections) {
    const sec = { ...asRecord(out[s.key]) };
    for (const f of s.fields) if (f.kind === "image") sec[imageKey(f.key)] = images[refKey(s.key, f.key)] ?? null;
    out[s.key] = sec;
  }
  return out;
}

// ---------- fields ----------

function ImageField({ sectionKey, field }: { sectionKey: string; field: FieldDef }) {
  // deferred: ছবি select করলে শুধু preview, upload হবে "Save" এ
  return (
    <FormImageUploader
      name={`${sectionKey}.${imageKey(field.key)}`}
      label={field.label}
      deferred
      aspect="4/3"
      size="md"
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

  // Server এ এখন যে ছবিগুলো আছে। Save সফল হলে যেগুলো আর নেই সেগুলো মুছব, প্রতি Save এ আপডেট হয়।
  const serverIdsRef = useRef<number[]>(savedImageIds(def, content));

  // Tab বদলালে/বন্ধ হলে upload না হওয়া ছবির blob preview মুক্ত করো
  useEffect(
    () => () => revokePendingImages(imageRefs(def, form.getValues()).map((r) => r.item)),
    [def, form],
  );

  const onSubmit = async (values: FieldValues) => {
    try {
      const refs = imageRefs(def, values);
      const images: Record<string, SavedImage> = {};

      // ১) নতুন ছবিগুলো upload (select করলে শুধু preview ছিল) ২) page settings save।
      // Save fail করলে এই submit এ upload হওয়া সব ছবি মুছে যায়।
      const res = await withUploadSession({ modelName: "banner" }, async (session) => {
        const saved = await session.resolveMany(refs.map((r) => r.item));
        refs.forEach((r, i) => {
          images[r.ref] = saved[i];
        });
        return savePageSettingAction(def.slug, cleanForSave(def, values, images));
      });

      if (res.success) {
        // ৩) বদলানো/সরানো পুরনো ছবি এখন server থেকে মুছো
        const finalIds = savedIds(Object.values(images));
        await deleteRemovedMedia(serverIdsRef.current, finalIds);
        serverIdsRef.current = finalIds;

        // Form এই page এ থেকে যায়, তাই pending file সরিয়ে server এর ছবি বসাই
        revokePendingImages(refs.map((r) => r.item));
        form.reset(withSavedImages(def, values, images));

        toast.success(res.message ?? "Saved.");
        router.refresh(); // tab এ ফিরলে সর্বশেষ data দেখাবে
      } else toast.error(res.message ?? "Could not save.");
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
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
