import { z } from "zod";
export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(5, "Message is required"),
});
export const replySchema = z.object({
  reply_message: z.string().min(3, "Reply is required"),
});
export type ContactInput = z.infer<typeof contactSchema>;
