

// import { connection } from "next/server";
// import type { Metadata } from "next";
// import { Suspense } from "react";
// import { AlertTriangle } from "lucide-react";
// import { parseTableParams } from "@/components/common/table/table-params";
// import { BulkTranslationEditor } from "@/components/dashboard/admin/translation/bulk-translation-editor";
// import { AddTranslationButton } from "@/components/dashboard/admin/translation/add-translation-button";
// import { SyncTranslationsButton } from "@/components/dashboard/admin/translation/sync-translations-button";
// import { TranslationTable } from "@/components/dashboard/admin/translation/translation-table";
// import { EmptyState } from "@/components/dashboard/shared/empty-state";
// import { PageHeader } from "@/components/dashboard/shared/page-header";
// import { getLanguagesAction } from "@/features/language/actions";
// import { getTranslationTableAction } from "@/features/translation/actions";

// export const metadata: Metadata = { title: "Translations" };

// async function TranslationsContent({
//   params,
// }: {
//   params: ReturnType<typeof parseTableParams>;
// }) {
  // await connection();

//   const [res, langs] = await Promise.all([
//     getTranslationTableAction(params),
//     getLanguagesAction(),
//   ]);
//   const languages = langs.languages ?? [];

//   return (
//     <div>
//       <PageHeader
//         title="Translations"
//         subtitle="Static English texts from the site. Fill in each language — empty cells fall back to English."
//         actions={
//           <>
//             <SyncTranslationsButton />
//             {languages.length > 0 && res.success && res.translations && (
//               <BulkTranslationEditor
//                 translations={res.translations}
//                 languages={languages}
//               />
//             )}
//             {languages.length > 0 && (
//               <AddTranslationButton languages={languages} />
//             )}
//           </>
//         }
//       />

//       {res.success && res.translations && res.meta && langs.success ? (
//         <TranslationTable
//           translations={res.translations}
//           languages={languages}
//           meta={res.meta}
//         />
//       ) : (
//         <EmptyState
//           icon={AlertTriangle}
//           title="Could not load translations"
//           description={res.message ?? langs.message}
//         />
//       )}
//     </div>
//   );
// }

// export default async function AdminTranslationsPage({
//   searchParams,
// }: {
//   searchParams: Promise<Record<string, string | string[] | undefined>>;
// }) {
//   const params = parseTableParams(await searchParams, [], 10);

//   return (
//     <Suspense
//       fallback={
//         <div className="p-6 text-sm text-muted-foreground">
//           Loading translations...
//         </div>
//       }
//     >
//       <TranslationsContent params={params} />
//     </Suspense>
//   );
// }


export const instant = false
import { connection } from "next/server";
import { Suspense } from "react";
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { parseTableParams } from "@/components/common/table/table-params";
import { BulkTranslationEditor } from "@/components/dashboard/admin/translation/bulk-translation-editor";
import { AddTranslationButton } from "@/components/dashboard/admin/translation/add-translation-button";
import { SyncTranslationsButton } from "@/components/dashboard/admin/translation/sync-translations-button";
import { TranslationTable } from "@/components/dashboard/admin/translation/translation-table";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { getLanguagesAction } from "@/features/language/actions";
import { getTranslationTableAction } from "@/features/translation/actions";

export const metadata: Metadata = { title: "Translations" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const SUBTITLE = "Static English texts from the site. Fill in each language — empty cells fall back to English.";

/** Page নিজে sync। শুধু Suspense ধরে, ডেটা আনার কাজ নিচের async component এ। */
export default async function AdminTranslationsPage({ searchParams }: { searchParams: SearchParams }) {
      await connection();

  return (
    <Suspense fallback={<TranslationsSkeleton />}>
      <TranslationsContent searchParams={searchParams} /> 
    </Suspense>
  );
}

/** ডেটা আসার আগে যা দেখায়: শিরোনাম আর একটা খালি table। */
function TranslationsSkeleton() {
  return (
    <div>
      <PageHeader title="Translations" subtitle={SUBTITLE} />
      <div className="space-y-3" aria-busy="true" aria-label="Loading translations">
        <div className="h-10 max-w-sm animate-pulse rounded-full bg-fg/10" />
        <div className="h-96 animate-pulse rounded-3xl border border-fg/15 bg-fg/5" />
      </div>
    </div>
  );
}

/** searchParams, cookie আর backend call এখানে। এই অংশটাই "dynamic", তাই Suspense এর ভেতরে থাকতে হয়। */
async function TranslationsContent({ searchParams }: { searchParams: SearchParams }) {
  const params = parseTableParams(await searchParams, [], 10);

  const [res, langs] = await Promise.all([getTranslationTableAction(params), getLanguagesAction()]);
  const languages = langs.languages ?? [];

  return (
    <div>
      <PageHeader
        title="Translations"
        subtitle={SUBTITLE}
        actions={
          <>
            <SyncTranslationsButton />
            {languages.length > 0 && <BulkTranslationEditor languages={languages} />}
            {languages.length > 0 && <AddTranslationButton languages={languages} />}
          </>
        }
      />
      {res.success && res.translations && res.meta && langs.success ? (
        <TranslationTable translations={res.translations} languages={languages} meta={res.meta} />
      ) : (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load translations"
          description={res.message ?? langs.message}
        />
      )}
    </div>
  );
}
