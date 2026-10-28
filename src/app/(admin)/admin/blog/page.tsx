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

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = parseTableParams(await searchParams, ["status"]);
  const [langRes, saved] = await Promise.all([getLanguagesAction(), getLanguageCookie()]);
  const languages = langRes.languages ?? [];
  const lang = pickLanguage(languages, saved);
  const res = await getAdminBlogsAction(params, lang);

  return (
    <div>
      <PageHeader
        title="Blog"
        subtitle="Create, approve and manage blog posts — same flow as events."
        actions={<AddBlogButton languages={languages} />}
      />
      {res.success && res.blogs && res.meta ? (
        <BlogTable blogs={res.blogs} meta={res.meta} lang={lang} languages={languages} />
      ) : (
        <EmptyState icon={AlertTriangle} title="Could not load blogs" description={res.message} />
      )}
    </div>
  );
}
