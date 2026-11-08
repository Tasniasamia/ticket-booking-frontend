import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { AddBlogButton } from "@/components/dashboard/admin/blog/add-blog-button";
import { BlogTable } from "@/components/dashboard/admin/blog/blog-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getAdminBlogsAction } from "@/features/blog/actions";
import { getLanguagesAction } from "@/features/language/actions";
import { pickLanguage } from "@/lib/localized";
import { getLanguageCookie } from "@/lib/preferences";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Blog" };

// ── আলাদা async child — এটাই Suspense-এ suspend করবে ──
async function BlogTableSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["status"]);
  const [langRes, saved] = await Promise.all([
    getLanguagesAction(),
    getLanguageCookie(),
  ]);
  const languages = langRes.languages ?? [];
  const lang = pickLanguage(languages, saved);
  const res = await getAdminBlogsAction(params, lang);

  if (res.success && res.blogs && res.meta) {
    return (
      <BlogTable
        blogs={res.blogs}
        meta={res.meta}
        lang={lang}
        languages={languages}
      />
    );
  }

  return (
    <EmptyState
      icon={AlertTriangle}
      title="Could not load blogs"
      description={res.message}
    />
  );
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {


  // Header-এর জন্য শুধু languages লাগে — এটা হালকা, তাড়াতাড়ি শেষ হবে
  const [langRes] = await Promise.all([getLanguagesAction()]);
  const languages = langRes.languages ?? [];

  return (
    <div>
      <PageHeader
        title="Blog"
        subtitle="Create, approve and manage blog posts — same flow as events."
        actions={<AddBlogButton languages={languages} />}
      />

      <Suspense
        fallback={
          <div className="h-96 animate-pulse rounded-3xl bg-fg/10" />
        }
      >
        <BlogTableSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}