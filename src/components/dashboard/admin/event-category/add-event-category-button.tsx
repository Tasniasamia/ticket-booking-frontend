"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal } from "@/components/common/table/modal";
import type { Language } from "@/features/language/types";
import { EventCategoryForm } from "./event-category-form";

export function AddEventCategoryButton({ languages }: { languages: Language[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-grad inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
      >
        <Plus className="size-4" /> Add event category
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add event category">
        <EventCategoryForm
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