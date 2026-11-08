import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddTestimonialButton } from "@/components/dashboard/admin/testimonial/add-testimonial-button";
import { TestimonialTable } from "@/components/dashboard/admin/testimonial/testimonial-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getTestimonialTableAction } from "@/features/testimonial/actions";

export const metadata: Metadata = { title: "Testimonials" };

async function TestimonialsContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["is_active"], 10);
  const res = await getTestimonialTableAction(params);

  if (res.success && res.testimonials && res.meta) {
    return (
      <TestimonialTable testimonials={res.testimonials} meta={res.meta} />
    );
  }
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Could not load testimonials"
      description={res.message}
    />
  );
}

export default function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div>
      <PageHeader
        title="Testimonials"
        subtitle="Customer reviews on the home page."
        actions={<AddTestimonialButton />}
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-fg/10" />}>
        <TestimonialsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
