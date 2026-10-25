import { z } from "zod";

// { en: "Music Night", bn: "সংগীত সন্ধ্যা" }
const translations = z.record(z.string(), z.string());

const atLeastOne = (message: string) =>
  translations.refine((v) => Object.values(v).some((s) => s.trim() !== ""), { message });

export const eventSchema = z.object({
  title: atLeastOne("কমপক্ষে একটা ভাষায় title দিতে হবে"),
  description: translations,
  location: atLeastOne("কমপক্ষে একটা ভাষায় location দিতে হবে"),

  // <input type="datetime-local"> এর value: "2026-11-01T18:30"
  starts_at: z.string().min(1, "Date and time is required"),

  total_tickets: z
    .number({ error: "Total tickets is required" })
    .int("Whole number only")
    .positive("Must be at least 1"),
  price: z
    .number({ error: "Price is required" })
    .int("Whole number only")
    .nonnegative("Price can't be negative"),
  currency: z.string().min(3, "Select a currency").max(10),

  // FormSelect এর value string, action এ number করা হয়
  category_id: z.string().min(1, "Select a category"),

  // thumbnail: upload এর পর id আর url দুটোই বসে
  thumbnail_id: z.number().int().positive("Thumbnail image is required"),
  thumbnail_url: z.string().min(1, "Thumbnail image is required"),

  images: z.array(z.object({ id: z.number(), url: z.string() })),
});

export type EventFormValues = z.infer<typeof eventSchema>;
