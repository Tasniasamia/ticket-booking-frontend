"use client";

import { useCallback, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type Options = {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
};

export function useConfirm() {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<Options>({ title: "" }); // বন্ধ হওয়ার animation এ লেখা যেন না হারায়
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback((o: Options) => {
    return new Promise<boolean>((resolve) => {
      resolver.current?.(false);
      resolver.current = resolve;
      setOpts(o);
      setOpen(true);
    });
  }, []);

  const settle = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOpen(false);
  };

  const dialog = (
    <Dialog open={open} onOpenChange={(o) => !o && settle(false)}>
      <DialogContent
        showCloseButton={false}
        className="cursor-default rounded-3xl bg-panel p-6 text-center ring-fg/15 sm:max-w-sm"
      >
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-rose-500/15 text-rose-500">
          <TriangleAlert className="size-6" />
        </div>
        <DialogTitle className="text-lg font-bold">{opts.title}</DialogTitle>
        <DialogDescription className={opts.text ? "text-sm text-fg/60" : "sr-only"}>
          {opts.text ?? opts.title}
        </DialogDescription>
        <div className="mt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => settle(false)}
            className="cursor-pointer rounded-full border border-fg/15 px-5 py-2.5 text-sm font-semibold hover:bg-fg/10"
          >
            {opts.cancelText ?? "Cancel"}
          </button>
          <button
            type="button"
            onClick={() => settle(true)}
            className="cursor-pointer rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
          >
            {opts.confirmText ?? "Confirm"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return [confirm, dialog] as const;
}