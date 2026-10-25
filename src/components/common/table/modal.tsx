// "use client";

// import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
// import { tableTheme } from "./table-theme";
// import { cn } from "cn";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   customWidth?: string;
//   title: string;
//   description?: string;
//   children: React.ReactNode;
// };

// /** Common dialog: view/edit যেখানেই লাগে, form বা content children হিসেবে দিন। */
// export function Modal({ open, onClose,customWidth, title, description, children }: Props) {
//   return (
//     <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
//       <DialogContent className={cn(tableTheme.dialog, customWidth)}>
//         <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
//         <DialogDescription className={description ? "text-sm text-fg/60" : "sr-only"}>
//           {description ?? title}
//         </DialogDescription>
//         {children}
//       </DialogContent>
//     </Dialog>
//   );
// }


// "use client";

// import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
// import { cn } from "@/lib/utils";
// import { tableTheme } from "./table-theme";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   /** Width override, jemon "sm:max-w-2xl". Na dile sm:max-w-md */
//   customWidth?: string;
//   title: string;
//   description?: string;
//   children: React.ReactNode;
// };

// /** Common dialog: view/edit যেখানেই লাগে, form বা content children হিসেবে দিন। */
// export function Modal({ open, onClose, customWidth, title, description, children }: Props) {
//   return (
//     <Dialog  open={open} onOpenChange={(o) => !o && onClose()}>
//       <DialogContent
//         className={cn(
//           tableTheme.dialog,
//           // screen এর ৯০% এর বেশি লম্বা হবে না, লম্বা হলে ভেতরে scroll হবে
//           "max-h-[90dvh] overflow-y-auto overscroll-contain",
//           customWidth ?? "sm:max-w-md",
//         )}
//       >
//         <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
//         <DialogDescription className={description ? "text-sm text-fg/60" : "sr-only"}>
//           {description ?? title}
//         </DialogDescription>
//         {children}
//       </DialogContent>
//     </Dialog>
//   );
// }




"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { tableTheme } from "./table-theme";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Width override, jemon "sm:max-w-2xl". Na dile sm:max-w-md */
  customWidth?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

/** Common dialog: view/edit যেখানেই লাগে, form বা content children হিসেবে দিন। */
export function Modal({ open, onClose, customWidth, title, description, children }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className={cn(
          tableTheme.dialog,
          // বাইরের popup: padding এখানে, নিজে scroll করে না
          "max-h-[90dvh] overflow-hidden",
          customWidth ?? "sm:max-w-md",
        )}
      >
        {/* ভেতরের wrapper scroll করে। -mr-3 + pr-3 দিয়ে scrollbar কে কিনারা থেকে সরিয়ে রাখা হয়েছে */}
        <div
          className={cn(
            "grid gap-4 overflow-y-auto overscroll-contain",
            "max-h-[calc(90dvh-3rem)] -mr-3 pr-3",
            "pretty-scroll",
          )}
        >
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <DialogDescription className={description ? "text-sm text-fg/60" : "sr-only"}>
            {description ?? title}
          </DialogDescription>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}