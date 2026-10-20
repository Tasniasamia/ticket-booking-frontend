import { z } from "zod";

export const CURRENCY_STATUS = ["enable", "disable"] as const;

// Client (RHF) আর server action দুজনেই এই schema ব্যবহার করে।
export const currencySchema = z.object({
  code: z.string().trim().min(3, "Code must be 3–10 letters").max(10, "Code must be 3–10 letters"),
  name: z.string().trim().min(1, "Enter the currency name"),
  symbol: z.string().trim().max(5, "Symbol is too long"),
  rateToBDT: z.number({ error: "Enter the rate" }).positive("Rate must be greater than 0"),
  status: z.enum(CURRENCY_STATUS, { error: "Choose a status" }),
  isDefault: z.boolean(),
});

export type CurrencyInput = z.infer<typeof currencySchema>;
