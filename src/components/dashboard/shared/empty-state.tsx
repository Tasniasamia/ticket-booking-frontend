import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

/**
 * "কিছু দেখানোর নেই" box. ComingSoon আর DataTable (data না থাকলে) দুজনেই এটা ব্যবহার করে,
 * তাই এই design এক জায়গায় বদলালেই সব page এ বদলে যায়।
 */
export function EmptyState({
  icon: Icon,
  title = "Nothing to show yet",
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-3xl border border-dashed border-fg/20 bg-panel/40 px-6 py-20 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="grid size-14 place-items-center rounded-2xl bg-fg/10">
          <Icon className="size-6 text-coral" />
        </span>
      )}
      <h2 className="mt-5 text-lg font-bold">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-sm text-fg/60">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
