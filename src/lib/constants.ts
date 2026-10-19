export const SESSION_COOKIE = "token";
export const PAYMENT_COOKIE = "pay_ok";
export const OTP_LENGTH = 6;

export type Role = "admin" | "manager" | "user";

export const ROLE_HOME: Record<Role, string> = { admin: "/admin", manager: "/manager", user: "/user" };
export const roleHome = (role?: string) => ROLE_HOME[role?.toLowerCase() as Role] ?? "/";
export const PROTECTED_AREAS: Record<string, Role> = { "/admin": "admin", "/manager": "manager", "/user": "user" };
export const AUTH_PAGES = ["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"];

// OTP flow: server action এ বসানো ছোট-মেয়াদী httpOnly cookie। proxy এটা দেখে /verify-otp আর /reset-password এ ঢুকতে দেয়।
// Cookie র মান: "<reason>:<email>"। এটা শুধু UI guard, আসল OTP যাচাই backend ই করে।
export const OTP_FLOW_COOKIE = "otp_flow";
export const OTP_FLOW_TTL_SEC = 15 * 120;
// registration = signup/unverified login, forgot-password = OTP এর অপেক্ষায়, reset-password = OTP verified, এখন নতুন password দেবে
export type OtpFlowReason = "registration" | "forgot-password" | "reset-password";

export function parseOtpFlow(raw?: string): { reason: OtpFlowReason; email: string } | null {
  if (!raw) return null;
  const i = raw.indexOf(":");
  if (i < 1) return null;
  const reason = raw.slice(0, i);
  const email = raw.slice(i + 1);
  if (reason !== "registration" && reason !== "forgot-password" && reason !== "reset-password") return null;
  if (!email.includes("@")) return null;
  return { reason, email };
}


// ---- Language & currency (user এর নিজের পছন্দ, cookie তে থাকে) ----
// Backend এর set-default API সবার জন্য site-wide default বদলায়, তাই user এর নিজের পছন্দ সেখানে পাঠাই না।
export const LANG_COOKIE = "lang";
export const CURRENCY_COOKIE = "currency";
export const PREF_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // ১ বছর
export const BASE_CURRENCY = "BDT"; // backend এর সব দাম এই currency তে (rate_to_bdt এর pivot)
export const FALLBACK_LANGUAGE = "en";
// mock-data এর price গুলো USD ধরা। real event API আসলে BASE_CURRENCY দিয়ে বদলে দিন।
export const MOCK_PRICE_CURRENCY = "USD";
