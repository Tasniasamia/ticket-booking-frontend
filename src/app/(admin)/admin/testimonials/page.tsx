export const instant = false;
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddTestimonialButton } from "@/components/dashboard/admin/testimonial/add-testimonial-button";
import { TestimonialTable } from "@/components/dashboard/admin/testimonial/testimonial-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getTestimonialTableAction } from "@/features/testimonial/actions";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = parseTableParams(await searchParams, ["is_active"], 10);
  const res = await getTestimonialTableAction(params);
  return (
    <div>
      <PageHeader title="Testimonials" subtitle="Customer reviews on the home page." actions={<AddTestimonialButton />} />
      {res.success && res.testimonials && res.meta ? (
        <TestimonialTable testimonials={res.testimonials} meta={res.meta} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load testimonials" description={res.message} />
      )}
    </div>
  );
}
