"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { roleHome } from "@/lib/constants";
import { clearOtpFlow, clearSession, setOtpFlow, setSession } from "@/lib/session";
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


export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    const user = await loginRequest(parsed.data);
    if (!user.token) return { success: false, message: "Token doesn't exist into login response" };
    // Backend unverified user কেও token দেয়। আমরা session না বসিয়ে আগে OTP verify করাই।
    if (!user.is_verified) {
      // নতুন OTP পাঠাই (আগেরটা এখনো চালু থাকলে backend আটকাবে, সেটা ignore করছি)
      await resendOtpRequest({ email: user.email, reason: "register" }).catch(() => {});
      await setOtpFlow(user.email, "registration");
      return { success: true, redirectTo: verifyUrl(user.email) };
    }
    await setSession(user.token);
    return { success: true, redirectTo: roleHome(user.role) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  
  try {
    const { name, email, password, role } = parsed.data;
    await registerRequest({ name, email, password, role });
    await setOtpFlow(email, "registration");
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
    await clearOtpFlow();
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
    await setOtpFlow(parsed.data.email, "forgot-password");
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
    await clearOtpFlow();
    return { success: true, message: "Password updated. Please log in.", redirectTo: "/login" };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
