import { z } from "zod";

// { en: "Music Night", bn: "সংগীত সন্ধ্যা" }
const translations = z.record(z.string(), z.string());

// Form এ একটা ছবি: server এ থাকলে { id, url }, upload বাকি থাকলে সাথে file (id negative, url = blob)।
// Upload হয় submit এর সময়, তাই action এ পৌঁছানোর আগে সব ছবির id positive হয়ে যায়।
// Server এ file থাকে না, তাই negative id (upload বাকি) action এই schema তেই আটকে যায়।
const imageItem = z
  .object({
    id: z.number().int(),
    url: z.string().min(1),
    file: z.custom<File>((v) => typeof File !== "undefined" && v instanceof File).optional(),
  })
  // Pending ছবির id সবসময় negative। Server এর ছবির id 0 হলেও (backend এ id না থাকলে) আটকাবে না।
  .refine((i) => i.id >= 0 || !!i.file, { message: "Image is not uploaded yet" });

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

  // thumbnail: select করলে File সহ বসে, submit এ upload হয়ে { id, url } হয়
  thumbnail: imageItem.nullable()// : boolean লিখে দিয়েছি, নইলে TS output type থেকে null বাদ দিয়ে useForm এর type এর সাথে মেলে না
    .refine((v): boolean => v !== null, { message: "Thumbnail image is required" }),

  images: z.array(imageItem),
});

export type EventFormValues = z.infer<typeof eventSchema>;
