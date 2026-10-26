import { z } from "zod";

export const paymentMethodSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Max 100 characters"),
  code: z.enum(["stripe", "sslcommerz"], { message: "Select a gateway" }),
  logo_url: z.string().trim().min(1, "Logo is required"),
  logo_id: z.number().int().positive("Logo is required"),
  enable: z.boolean(),
  credentials: z
    .array(z.object({ key: z.string().trim().min(1, "Key"), value: z.string().trim().min(1, "Value") }))
    .min(1, "Add at least one credential")
    .refine((rows) => new Set(rows.map((r) => r.key.trim())).size === rows.length, { message: "Credential keys must be unique" }),
});

export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>;
