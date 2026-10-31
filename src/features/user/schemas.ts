import { z } from "zod";

// Form (client) আর PATCH /api/me (server) দুই জায়গায় একই schema।
export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  address: z.string().trim().max(200, "Address is too long"),
  phone_number: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^\+?[\d\s-]{6,20}$/.test(v),
      "Enter a valid phone number",
    ),
  country: z.string().trim().max(80, "Country is too long"),
  designation: z.string().trim().max(80, "Designation is too long"),
  profile_image_id: z.number().nullable(),
  profile_image: z.string().url().nullable(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const profileSchemaAdmin = z.object({
  designation: z.string().trim().max(80, "Designation is too long"),
  status: z.enum(["active", "deactivated"]),
  role: z.enum(["user", "manager", "admin"]),
  is_verified: z.boolean(),
});

export type ProfileInputAdmin = z.infer<typeof profileSchemaAdmin>;