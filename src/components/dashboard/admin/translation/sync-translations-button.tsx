"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { syncDefaultTranslationsAction } from "@/features/translation/actions";

/** DEFAULT_MESSAGES এর যে English text গুলো backend এ নেই, সেগুলো key হিসেবে যোগ করে (en = same text)। আগের অনুবাদ ছোঁয় না। */
export function SyncTranslationsButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const sync = () =>
    startTransition(async () => {
      const res = await syncDefaultTranslationsAction();
      if (res.success) toast.success(res.message ?? "Synced.");
      else toast.error(res.message ?? "Could not sync.");
      router.refresh();
    });

  return (
    <button type="button" onClick={sync} disabled={pending} className="glass inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-fg/10 disabled:opacity-60">
      {pending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
      Sync static texts
    </button>
  );
}
