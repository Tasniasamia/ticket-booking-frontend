import { cn } from "@/lib/utils";

/** Dashboard এর প্রতিটা page এর উপরের শিরোনাম। ডানে button বসাতে চাইলে actions দাও। */
export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-sm text-fg/60 sm:text-base">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}
