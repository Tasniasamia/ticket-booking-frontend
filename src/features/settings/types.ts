// Backend: internal/settings (GET/PUT /settings, GET/PUT /settings/pages/:slug)

type Raw = Record<string, unknown>;

export type SocialLink = { name: string; link: string };

export type SiteSettings = {
  site_name: string;
  site_email: string;
  site_phone: string;
  site_logo: string;
  site_address: string;
  site_description: string;
  site_footer: string;
  client_side_url: string;
  server_side_url: string;
  social_media_link: SocialLink[];
};

export const EMPTY_SITE_SETTINGS: SiteSettings = {
  site_name: "",
  site_email: "",
  site_phone: "",
  site_logo: "",
  site_address: "",
  site_description: "",
  site_footer: "",
  client_side_url: "",
  server_side_url: "",
  social_media_link: [],
};

const str = (v: unknown) => (typeof v === "string" ? v : "");

/**
 * Backend response এ Stripe/SSLCommerz secret ও আসে। এখানে শুধু site এর public field রাখি,
 * যাতে secret কোনোভাবেই client component এ না পৌঁছায়।
 */
export function toSiteSettings(d: Raw): SiteSettings {
  const links = Array.isArray(d.social_media_link) ? (d.social_media_link as Raw[]) : [];
  return {
    site_name: str(d.site_name),
    site_email: str(d.site_email),
    site_phone: str(d.site_phone),
    site_logo: str(d.site_logo),
    site_address: str(d.site_address),
    site_description: str(d.site_description),
    site_footer: str(d.site_footer),
    client_side_url: str(d.client_side_url),
    server_side_url: str(d.server_side_url),
    social_media_link: links.map((l) => ({ name: str(l.name), link: str(l.link) })),
  };
}

// ---- Page settings ----

/** { en: "...", bn: "..." } */
export type Localized = Record<string, string>;

/** { hero: { title: {...}, ... }, about: { ... } } — backend এ jsonb হিসেবে থাকে */
export type PageContent = Record<string, Record<string, unknown>>;

export function toPageContent(raw: unknown): PageContent {
  let v = raw;
  if (typeof v === "string") {
    try {
      v = JSON.parse(v);
    } catch {
      return {};
    }
  }
  if (!v || typeof v !== "object" || Array.isArray(v)) return {};
  const out: PageContent = {};
  for (const [k, section] of Object.entries(v as Raw)) {
    if (section && typeof section === "object" && !Array.isArray(section)) out[k] = section as Record<string, unknown>;
  }
  return out;
}
