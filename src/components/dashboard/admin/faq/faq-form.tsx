"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import type { FAQ } from "@/features/faq/types";
import { createFAQAction, updateFAQAction } from "@/features/faq/actions";
import {
  createTranslationAction,
  bulkSaveTranslationsAction,
} from "@/features/translation/actions";

const field = "w-full rounded-xl border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-coral";

export function FAQForm({ faq, onSuccess }: { faq?: FAQ; onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [isActive, setIsActive] = useState(faq?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(faq?.sort_order ?? 0);

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const payload = {
    question: question.trim(),
    answer: answer.trim(),
    is_active: isActive,
    sort_order: sortOrder,
  };

  // 1) আগে FAQ save
  const res = faq
    ? await updateFAQAction(faq.id, payload)
    : await createFAQAction(payload);

  if (!res.success) {
    setLoading(false);
    toast.error(res.message ?? "Failed.");
    return;
  }

  // 2) Translation keys add (fail হলে FAQ তো save হয়ে গেছে — soft fail)
  try {
    // create — key আগে থাকলে error হতে পারে
    // await createTranslationAction({
    //   key: payload.question,
    //   values: { en: payload.question },
    // });
    // await createTranslationAction({
    //   key: payload.answer,
    //   values: { en: payload.answer },
    // });

    // অথবা bulk (যদি action support করে):
    await bulkSaveTranslationsAction([
      { key: payload.question, values: { en: payload.question } },
      { key: payload.answer, values: { en: payload.answer } },
    ]);
  } catch {
    // optional: toast.warn("FAQ saved, but translation keys failed");
  }

  setLoading(false);
  toast.success(res.message ?? "Saved.");
  onSuccess?.();
  router.refresh();
};

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-fg/55">Question</label>
        <input className={field} value={question} onChange={(e) => setQuestion(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-xs text-fg/55">Answer</label>
        <textarea className={field} rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-fg/55">Sort order</label>
          <input className={field} type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active
        </label>
      </div>
      <button type="submit" disabled={loading} className="btn-grad w-full rounded-full py-2.5 text-sm font-semibold disabled:opacity-60">
        {loading ? "Saving..." : faq ? "Save changes" : "Create FAQ"}
      </button>
    </form>
  );
}
