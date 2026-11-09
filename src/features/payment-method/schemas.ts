import { z } from "zod";
import { imageItemSchema } from "@/features/media/schemas";

export const paymentMethodSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Max 100 characters"),
  code: z.enum(["stripe", "sslcommerz"], { message: "Select a gateway" }),
  // logo: select করলে File সহ বসে, submit এ upload হয়ে { id, url } হয়।
  // : boolean লিখেছি, নইলে TS output type থেকে null বাদ দিয়ে useForm এর type এর সাথে মেলে না
  logo: imageItemSchema.nullable().refine((v): boolean => v !== null, { message: "Logo is required" }),
  enable: z.boolean(),
  credentials: z
    .array(z.object({ key: z.string().trim().min(1, "Key"), value: z.string().trim().min(1, "Value") }))
    .min(1, "Add at least one credential")
    .refine((rows) => new Set(rows.map((r) => r.key.trim())).size === rows.length, { message: "Credential keys must be unique" }),
});

export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>;
