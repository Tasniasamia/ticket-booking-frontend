import { z } from "zod";
import { imageItemSchema } from "@/features/media/schemas";

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().optional(),
  text: z.string().min(5, "Text is required"),
  // Photo optional। select করলে File সহ বসে, submit এ upload হয়ে { id, url } হয়।
  image: imageItemSchema.nullable().optional(),
  is_active: z.boolean().optional(),
  // coerce ব্যবহার করো না
  sort_order: z.number().int().optional(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;