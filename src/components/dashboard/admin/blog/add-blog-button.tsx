"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal } from "@/components/common/table/modal";
import type { Language } from "@/features/language/types";
import { BlogForm } from "./blog-form";

type Props = { languages: Language[] };

export function AddBlogButton({ languages }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-grad inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
      >
        <Plus className="size-4" /> Add blog
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add blog" customWidth="sm:max-w-3xl">
        <BlogForm
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
