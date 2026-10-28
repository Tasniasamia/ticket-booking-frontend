import { z } from "zod";

const translations = z.record(z.string(), z.string());

const atLeastOne = (message: string) =>
  translations.refine((v) => Object.values(v).some((s) => s.trim() !== ""), { message });

export const blogSchema = z.object({
  title: atLeastOne("Title is required in at least one language"),
  short_description: translations,
  long_description: translations,
  slug: z.string().optional(),
  thumbnail_id: z.number().int().positive("Thumbnail image is required"),
  thumbnail_url: z.string().min(1, "Thumbnail image is required"),
  images: z.array(z.object({ id: z.number(), url: z.string() })),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
