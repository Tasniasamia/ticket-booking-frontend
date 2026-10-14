export const SESSION_COOKIE = "token";
export const PAYMENT_COOKIE = "pay_ok";
export const OTP_LENGTH = 6;

export type Role = "admin" | "manager" | "user";

export const ROLE_HOME: Record<Role, string> = { admin: "/admin", manager: "/manager", user: "/user" };
export const roleHome = (role?: string) => ROLE_HOME[role?.toLowerCase() as Role] ?? "/";
export const PROTECTED_AREAS: Record<string, Role> = { "/admin": "admin", "/manager": "manager", "/user": "user" };
export const AUTH_PAGES = ["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"];
