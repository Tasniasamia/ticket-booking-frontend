"use client";

import { createContext, useContext } from "react";
import { EMPTY_SITE_SETTINGS, type SiteSettings } from "@/features/settings/types";

const Ctx = createContext<SiteSettings>(EMPTY_SITE_SETTINGS);

/** Root layout server এ settings পড়ে এখানে দেয়, তাই header/footer/contact এ কোনো loading flash থাকে না। */
export function SiteSettingsProvider({ value, children }: { value: SiteSettings; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSiteSettings = () => useContext(Ctx);
