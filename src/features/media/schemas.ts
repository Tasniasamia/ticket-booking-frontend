import { z } from "zod";

/**
 * Form এ একটা ছবি: server এ থাকলে { id, url }, upload বাকি থাকলে সাথে file (id negative, url = blob)।
 * Upload হয় submit এর সময়, তাই server action এ পৌঁছানোর আগে সব ছবির id positive হয়ে যায়।
 * File server এ যায় না, তাই negative id (upload বাকি) থাকলে action এর schema তেই আটকে যায়।
 */
export const imageItemSchema = z
  .object({
    id: z.number().int(),
    url: z.string().min(1),
    file: z.custom<File>((v) => typeof File !== "undefined" && v instanceof File).optional(),
  })
  // Pending ছবির id সবসময় negative। Server এর ছবির id 0 হলেও (backend এ id না থাকলে) আটকাবে না।
  .refine((i) => i.id >= 0 || !!i.file, { message: "Image is not uploaded yet" });
