"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal } from "@/components/common/table/modal";
import type { Language } from "@/features/language/types";
import type { Currency } from "@/features/currency/types";
import { EventForm, type CategoryOption } from "@/components/dashboard/events/event-form";

type Props = { languages: Language[]; categories: CategoryOption[]; currencies: Currency[] };

export function AddEventButton({ languages, categories, currencies }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-grad inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
      >
        <Plus className="size-4" /> Add event
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add event" customWidth="sm:max-w-3xl">
        <EventForm
          languages={languages}
          categories={categories}
          currencies={currencies}
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </Modal>
    </>
  );
}
