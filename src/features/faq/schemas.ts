import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().min(3, "Question is required"),
  answer: z.string().min(3, "Answer is required"),
  is_active: z.boolean().optional(),
  sort_order: z.coerce.number().int().optional(),
});

export type FAQInput = z.infer<typeof faqSchema>;
