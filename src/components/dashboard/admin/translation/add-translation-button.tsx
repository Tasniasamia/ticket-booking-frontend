"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal } from "@/components/common/table/modal";
import type { Language } from "@/features/language/types";
import { TranslationForm } from "./translation-form";

/** Optional: add one static English text + its translations (modify2 allows single or bulk). */
export function AddTranslationButton({ languages }: { languages: Language[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-grad inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
      >
        <Plus className="size-4" /> Add text
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add text"
        description="Enter the English text used in code (e.g. Home). Then fill translations for each language."
      >
        <TranslationForm
          languages={languages}
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </Modal>
    </>
  );
}
