import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().optional(),
  text: z.string().min(5, "Text is required"),
  image_id: z.number().int().optional(),
  image_url: z.string().optional(),
  is_active: z.boolean().optional(),
  // coerce ব্যবহার করো না
  sort_order: z.number().int().optional(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;