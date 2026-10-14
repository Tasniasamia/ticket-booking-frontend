import { z } from "zod";
import { OTP_LENGTH } from "@/lib/constants";

// একই schema client (RHF) আর server (Server Action) দুই জায়গায় ব্যবহার হয়।
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/\d/, "Password must contain a number");

const email = z.email("Enter a valid email address");
const otp = z.string().regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Enter the ${OTP_LENGTH}-digit code`);

export const loginSchema = z.object({ email, password: z.string().min(1, "Enter your password") });

// Admin এখানে ইচ্ছা করেই নেই। Admin তৈরি হবে শুধু database/admin panel থেকে।
export const REGISTER_ROLES = ["user", "manager"] as const;

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email,
    password,
    confirmPassword: z.string().min(1, "Confirm your password"),
    role: z.enum(REGISTER_ROLES, { error: "Choose a role" }),
    terms: z.boolean().refine((v) => v, "You must accept the terms and privacy policy"),
    captcha: z.string().min(1, "Please confirm you are not a robot"),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

export const verifyOtpSchema = z.object({ email, otp });
export const forgotPasswordSchema = z.object({ email });
export const resendOtpSchema = z.object({ email, reason: z.enum(["register", "reset_password"]) });

export const resetPasswordSchema = z
  .object({ email, otp, newPassword: password, confirmPassword: z.string().min(1, "Confirm your password") })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
