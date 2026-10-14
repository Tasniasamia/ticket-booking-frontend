"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { roleHome } from "@/lib/constants";
import { clearSession, setSession } from "@/lib/session";
import {
  forgotPasswordSchema, loginSchema, registerSchema, resendOtpSchema, resetPasswordSchema, verifyOtpSchema,
  type ForgotPasswordInput, type LoginInput, type RegisterInput, type ResendOtpInput, type ResetPasswordInput, type VerifyOtpInput,
} from "./schemas";
import {
  forgotPasswordRequest, getErrorMessage, loginRequest, registerRequest, resendOtpRequest, resetPasswordRequest, verifyOtpRequest,
} from "./service";

export type ActionResult = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  redirectTo?: string;
};

const invalid = (error: z.ZodError): ActionResult => ({
  success: false, message: "Please check the form.", fieldErrors: z.flattenError(error).fieldErrors,
});
const verifyUrl = (email: string) => `/verify-otp?email=${encodeURIComponent(email)}`;

async function verifyCaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  return ((await res.json()) as { success?: boolean }).success === true;
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    const user = await loginRequest(parsed.data);
    if (!user.token) return { success: false, message: "Token doesn't exist into login response" };
    // Backend unverified user কেও token দেয়। আমরা session না বসিয়ে আগে OTP verify করাই।
    if (!user.is_verified) return { success: true, redirectTo: verifyUrl(user.email) };
    await setSession(user.token);
    return { success: true, redirectTo: roleHome(user.role) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  if (!(await verifyCaptcha(parsed.data.captcha))) {
    return { success: false, message: "reCAPTCHA check failed. Please try again.", fieldErrors: { captcha: ["Verification failed"] } };
  }
  try {
    const { name, email, password, role } = parsed.data;
    await registerRequest({ name, email, password, role });
    return { success: true, redirectTo: verifyUrl(email) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function verifyOtpAction(input: VerifyOtpInput): Promise<ActionResult> {
  const parsed = verifyOtpSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await verifyOtpRequest({ ...parsed.data, reason: "register" });
    // পুরনো token এ is_verified=false লেখা আছে, তাই মুছে নতুন করে login করাই।
    await clearSession();
    return { success: true, message: "Email verified. Please log in.", redirectTo: "/login" };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function resendOtpAction(input: ResendOtpInput): Promise<ActionResult> {
  const parsed = resendOtpSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await resendOtpRequest(parsed.data);
    return { success: true, message: "A new code was sent to your email." };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function forgotPasswordAction(input: ForgotPasswordInput): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    await forgotPasswordRequest(parsed.data.email);
    return { success: true, redirectTo: `/reset-password?email=${encodeURIComponent(parsed.data.email)}` };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    const { email, otp, newPassword } = parsed.data;
    await resetPasswordRequest({ email, otp, new_password: newPassword });
    return { success: true, message: "Password updated. Please log in.", redirectTo: "/login" };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
