import { z } from "zod";

const url = (msg: string) => z.string().trim().refine((v) => v === "" || /^https?:\/\//i.test(v), { message: msg });

export const siteSettingsSchema = z.object({
  site_name: z.string().trim().min(1, "Site name is required"),
  site_email: z.string().trim().refine((v) => v === "" || z.email().safeParse(v).success, { message: "Enter a valid email" }),
  site_phone: z.string().trim(),
  site_logo: z.string().trim(),
  site_address: z.string().trim(),
  site_description: z.string().trim(),
  site_footer: z.string().trim(),
  client_side_url: url("Must start with http:// or https://"),
  server_side_url: url("Must start with http:// or https://"),
  social_media_link: z.array(
    z.object({
      name: z.string().trim().min(1, "Name"),
      link: z.string().trim().min(1, "Link").refine((v) => /^https?:\/\//i.test(v), { message: "Must start with http(s)://" }),
    }),
  ),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

// Page content এর shape config থেকে আসে (page-config.ts), তাই এখানে ঢিলা কিন্তু নিরাপদ schema:
// section → field → (string | number | object | array)। শুধু অস্বাভাবিক বড় data আটকাই।
export const pageContentSchema = z
  .record(z.string(), z.record(z.string(), z.unknown()))
  .refine((v) => JSON.stringify(v).length < 200_000, { message: "Content is too large" });
