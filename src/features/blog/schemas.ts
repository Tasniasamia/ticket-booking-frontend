import { z } from "zod";
import { imageItemSchema } from "@/features/media/schemas";

const translations = z.record(z.string(), z.string());

const atLeastOne = (message: string) =>
  translations.refine((v) => Object.values(v).some((s) => s.trim() !== ""), { message });

export const blogSchema = z.object({
  title: atLeastOne("Title is required in at least one language"),
  short_description: translations,
  long_description: translations,
  slug: z.string().optional(),
  // thumbnail: select করলে File সহ বসে, submit এ upload হয়ে { id, url } হয়।
  // : boolean লিখেছি, নইলে TS output type থেকে null বাদ দিয়ে useForm এর type এর সাথে মেলে না
  thumbnail: imageItemSchema
    .nullable()
    .refine((v): boolean => v !== null, { message: "Thumbnail image is required" }),
  images: z.array(imageItemSchema),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
