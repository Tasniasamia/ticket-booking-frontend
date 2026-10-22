import { z } from "zod";

export const languageSchema = z
  .object({
    name: z.string().trim().min(2, "Enter the language name").max(50),
    code: z
      .string()
      .trim()
      .min(2)
      .max(5)
      .regex(/^[A-Za-z]{2,3}(-[A-Za-z]{2})?$/, "Use a code like en, bn or zh-CN"),
    rtl: z.boolean(),
    isActive: z.boolean(),
    isDefault: z.boolean(),
    flag: z.string().trim().max(255),
  })
  .refine((d) => !d.isDefault || d.isActive, {
    message: "The default language must be active",
    path: ["isActive"],
  });

export type LanguageInput = z.infer<typeof languageSchema>;