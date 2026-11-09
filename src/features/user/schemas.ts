import { z } from "zod";
import { imageItemSchema } from "@/features/media/schemas";

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
  // select করলে File সহ বসে, Save এ upload হয়ে { id, url } হয়। ছবি না থাকলে null।
  profile_image: imageItemSchema.nullable(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const profileSchemaAdmin = z.object({
  designation: z.string().trim().max(80, "Designation is too long"),
  status: z.enum(["active", "deactivated"]),
  role: z.enum(["user", "manager", "admin"]),
  is_verified: z.boolean(),
});

export type ProfileInputAdmin = z.infer<typeof profileSchemaAdmin>;


const newPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/\d/, "Password must contain a number");

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword,
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;