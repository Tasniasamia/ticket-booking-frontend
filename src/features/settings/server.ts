import axios from "axios";
import { cacheLife, cacheTag } from "next/cache";
import { getPageSettingRequest, getSettingsRequest } from "./service";
import { EMPTY_SITE_SETTINGS, toPageContent, toSiteSettings, type PageContent, type SiteSettings } from "./types";
import type { PageSlug } from "./page-config";

// Public site এর জন্য cached read। Admin save করলে actions.ts এ updateTag() ডেকে এই cache ফেলে দেওয়া হয়।
// "use cache" function throw করলে সেই result cache হয় না, তাই backend বন্ধ থাকলে ভুল data আটকে থাকে না।

export const SITE_SETTINGS_TAG = "site-settings";
export const pageSettingsTag = (slug: string) => `page-settings-${slug}`;

async function fetchSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(SITE_SETTINGS_TAG);
  cacheLife("minutes");
  const res = await getSettingsRequest();
  return toSiteSettings(res.data.data ?? {});
}

async function fetchPageContent(slug: PageSlug): Promise<PageContent> {
  "use cache";
  cacheTag(pageSettingsTag(slug));
  cacheLife("minutes");
  try {
    const res = await getPageSettingRequest(slug);
    return toPageContent(res.data.data?.content);
  } catch (err) {
    // Backend এখন page না পেলে 500 "record not found" দেয়। সেটা "এখনো save হয়নি" মানে, তাই খালি content cache করা ঠিক।
    if (axios.isAxiosError(err) && err.response && /not found/i.test(String(err.response.data?.errorMessage ?? ""))) return {};
    throw err;
  }
}

/** Header, footer, contact এ লাগে। backend না পেলে খালি settings, তাই UI এর default লেখাই দেখায়। */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await fetchSiteSettings();
  } catch {
    return EMPTY_SITE_SETTINGS;
  }
}

export async function getPageContent(slug: PageSlug): Promise<PageContent> {
  try {
    return await fetchPageContent(slug);
  } catch {
    return {};
  }
}
