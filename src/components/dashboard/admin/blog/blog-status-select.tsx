"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateBlogStatusAction } from "@/features/blog/actions";
import type { BlogStatus } from "@/features/blog/types";
import { BLOG_STATUSES } from "@/features/blog/types";

const tones: Record<BlogStatus, string> = {
  pending: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  approved: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  canceled: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

export function BlogStatusSelect({ blogId, status }: { blogId: number; status: BlogStatus }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as BlogStatus;
        start(async () => {
          const res = await updateBlogStatusAction(blogId, next);
          if (res.success) {
            toast.success(res.message);
            router.refresh();
          } else {
            toast.error(res.message ?? "Failed");
          }
        });
      }}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize outline-none ${tones[status] ?? ""}`}
    >
      {BLOG_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-panel text-fg">
          {s}
        </option>
      ))}
    </select>
  );
}
