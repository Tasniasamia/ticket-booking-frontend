"use server";

import axios from "axios";
import { updateTag } from "next/cache";
import { z } from "zod";
import { getErrorMessage } from "@/features/auth/service";
import type { ActionResult } from "@/components/common/table/data-table";
import { getPageSettingRequest, getSettingsRequest, listMediaRequest, upsertPageSettingRequest, upsertSettingsRequest } from "./service";
import { pageContentSchema, siteSettingsSchema, type SiteSettingsInput } from "./schemas";
import { PAGE_SLUGS, isPageSlug, type PageSlug } from "./page-config";
import { SITE_SETTINGS_TAG, pageSettingsTag } from "./server";
import { toPageContent, toSiteSettings, type PageContent, type SiteSettings } from "./types";

export type SettingsFormResult = ActionResult & { fieldErrors?: Record<string, string[] | undefined> };

// ---------- Admin: fresh read (cache ছাড়া) ----------

export async function getSiteSettingsAdminAction(): Promise<{ success: boolean; message?: string; settings?: SiteSettings }> {
  try {
    const res = await getSettingsRequest();
    return { success: true, settings: toSiteSettings(res.data.data ?? {}) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function getAllPageContentsAction(): Promise<{ success: boolean; message?: string; pages: Record<PageSlug, PageContent> }> {
  const pages = Object.fromEntries(PAGE_SLUGS.map((s) => [s, {}])) as Record<PageSlug, PageContent>;
  let failed: string | undefined;
  await Promise.all(
    PAGE_SLUGS.map(async (slug) => {
      try {
        const res = await getPageSettingRequest(slug);
        pages[slug] = toPageContent(res.data.data?.content);
      } catch (err) {
        // এখনো save না হওয়া page = খালি, সেটা error না
        const notFound = axios.isAxiosError(err) && /not found/i.test(String(err.response?.data?.errorMessage ?? ""));
        if (!notFound) failed = getErrorMessage(err);
      }
    }),
  );
  return { success: !failed, message: failed, pages };
}

/** Logo/ছবির media id বের করি (settings এ শুধু URL থাকে), যাতে "remove" কাজ করে। */
export async function findMediaIdByUrlAction(url: string, modelName: string): Promise<number | null> {
  if (!url) return null;
  try {
    const res = await listMediaRequest(modelName);
    return res.data.data.docs.find((m) => m.public_url === url)?.id ?? null;
  } catch {
    return null;
  }
}

// ---------- Admin: save ----------

export async function saveSiteSettingsAction(input: SiteSettingsInput): Promise<SettingsFormResult> {
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please check the form.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  try {
    await upsertSettingsRequest(parsed.data);
    updateTag(SITE_SETTINGS_TAG);
    return { success: true, message: "Site settings saved." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function savePageSettingAction(slug: string, content: unknown): Promise<SettingsFormResult> {
  if (!isPageSlug(slug)) return { success: false, message: "Unknown page." };
  const parsed = pageContentSchema.safeParse(content);
  if (!parsed.success) return { success: false, message: "Please check the form." };
  try {
    await upsertPageSettingRequest(slug, parsed.data);
    updateTag(pageSettingsTag(slug));
    return { success: true, message: "Page settings saved." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
