import Link from "next/link";
import { T } from "@/components/shared/t";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Section({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 sm:py-24", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  title, subtitle, href, hrefLabel = <T k="View all" />, className,
}: { title: React.ReactNode; subtitle?: React.ReactNode; href?: string; hrefLabel?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-base leading-relaxed text-fg/65">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm font-semibold text-coral hover:underline focus-visible:outline-2 focus-visible:outline-coral">
          {hrefLabel}
        </Link>
      )}
    </div>
  );
}
