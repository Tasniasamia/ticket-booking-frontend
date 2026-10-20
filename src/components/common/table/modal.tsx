"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { tableTheme } from "./table-theme";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};

/** Common dialog: view/edit যেখানেই লাগে, form বা content children হিসেবে দিন। */
export function Modal({ open, onClose, title, description, children }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={tableTheme.dialog}>
        <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        <DialogDescription className={description ? "text-sm text-fg/60" : "sr-only"}>
          {description ?? title}
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
