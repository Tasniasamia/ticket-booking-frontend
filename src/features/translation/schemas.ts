import { z } from "zod";

// Key = the English static text itself (modify2 style), e.g. "Home", "Log in".
// Spaces and punctuation allowed so full phrases can be keys.
export const translationSchema = z
  .object({
    key: z
      .string()
      .trim()
      .min(1, "Enter the English text")
      .max(255, "Text is too long"),
    values: z.record(z.string(), z.string()),
  })
  .refine((d) => Object.values(d.values).some((v) => v.trim() !== ""), {
    message: "Write the text in at least one language",
    path: ["values"],
  });

export type TranslationInput = z.infer<typeof translationSchema>;
