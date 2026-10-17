"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { roleHome } from "@/lib/constants";
import { clearOtpFlow, clearSession, getOtpFlow, setOtpFlow, setSession } from "@/lib/session";
import {
  forgotPasswordSchema, loginSchema, registerSchema, resendOtpSchema, resetPasswordSchema, verifyOtpSchema,
  type ForgotPasswordInput, type LoginInput, type RegisterInput, type ResendOtpInput, type ResetPasswordInput, type VerifyOtpInput,
} from "./schemas";
import {
  forgotPasswordRequest, getErrorMessage, loginRequest, registerRequest, resendOtpRequest, resetPasswordRequest, verifyOtpRequest,
  type LoginData,
} from "./service";

export type LoginUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
};
export type ActionResult = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  redirectTo?: string;
  user?: LoginUser;
};

const invalid = (error: z.ZodError): ActionResult => ({
  success: false, message: "Please check the form.", fieldErrors: z.flattenError(error).fieldErrors,
});
const verifyUrl = (email: string, reason: "register" | "reset_password" = "register") =>
  `/verify-otp?email=${encodeURIComponent(email)}&reason=${reason}`;
const SESSION_EXPIRED = "Your session expired. Please start again.";

// token কে client এ পাঠানো যাবে না, তাই শুধু দরকারি field গুলো নিই।
const toLoginUser = (d: LoginData): LoginUser => ({
  id: d.id, name: d.name, email: d.email, role: d.role, is_verified: d.is_verified,
});

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  try {
    const res = await loginRequest(parsed.data);
    if (!res.data.token) return { success: false, message: "Token doesn't exist into login response" };
    // Backend unverified user কেও token দেয়। আমরা session না বসিয়ে আগে OTP verify করাই।
    if (!res.data.is_verified) {
      // নতুন OTP পাঠাই (আগেরটা এখনো চালু থাকলে backend আটকাবে, সেটা ignore করছি)
      await resendOtpRequest({ email: res.data.email, reason: "register" }).catch(() => {});
      await setOtpFlow(res.data.email, "registration");
      return { success: true, redirectTo: verifyUrl(res.data.email), user: toLoginUser(res.data) };
    }
    await setSession(res.data.token);
    return { success: true, redirectTo: roleHome(res.data.role), user: toLoginUser(res.data) };
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
  const flow = await getOtpFlow();
  if (!flow || flow.reason === "reset-password" || flow.email.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return { success: false, message: SESSION_EXPIRED };
  }
  const isReset = flow.reason === "forgot-password";
  try {
    await verifyOtpRequest({ ...parsed.data, reason: isReset ? "reset_password" : "register" });
    if (isReset) {
      // OTP ঠিক, তাই flow কে পরের ধাপে (reset-password) তুলি। OTP টা URL এ করে reset page এ যায়।
      await setOtpFlow(flow.email, "reset-password");
      return { success: true, message: "Code verified. Choose a new password.", redirectTo: `/reset-password?email=${encodeURIComponent(flow.email)}&otp=${encodeURIComponent(parsed.data.otp)}` };
    }
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
    return { success: true, redirectTo: verifyUrl(parsed.data.email, "reset_password") };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  // email নিই cookie থেকে (client এর কথায় নয়), OTP আসে form থেকে।
  const flow = await getOtpFlow();
  if (!flow || flow.reason !== "reset-password") return { success: false, message: SESSION_EXPIRED };
  try {
    await resetPasswordRequest({ email: flow.email, otp: parsed.data.otp, new_password: parsed.data.newPassword });
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