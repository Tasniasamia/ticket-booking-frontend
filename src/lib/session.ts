import { cookies } from "next/headers";
import { OTP_FLOW_COOKIE, OTP_FLOW_TTL_SEC, SESSION_COOKIE, parseOtpFlow, type OtpFlowReason } from "@/lib/constants";
import { decodeJwt, isExpired } from "@/lib/jwt";

const FALLBACK_TTL_MS = 24 * 60 * 60 * 1000; // backend এর defaultTokenDuration (24h)

/**
 * Backend token দেয় response body তে, cookie দেয় না। তাই Next.js server নিজেই token টা
 * httpOnly cookie তে রাখে। Cookie র মেয়াদ token এর নিজের `exp` থেকে নেওয়া হয়,
 * তাই backend এ duration বদলালে এখানে কিছু বদলাতে হবে না।
 */
export async function setSession(token: string) {
  const claims = decodeJwt(token);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: claims?.exp ? new Date(claims.exp * 1000) : new Date(Date.now() + FALLBACK_TTL_MS),
  });
}

/** মেয়াদ শেষ হলে undefined ফেরত দেয়, মানে logged out। */
export async function getToken() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return undefined;
  const claims = decodeJwt(token);
  return claims && !isExpired(claims) ? token : undefined;
}

export async function getSessionUser() {
  const token = await getToken();
  const c = token ? decodeJwt(token) : null;
  if (!c) return null;
  return { id: c.user_id, name: c.name, email: c.email, role: c.role.toLowerCase(), isVerified: c.is_verified };
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** OTP page এ ঢোকার অনুমতি। signup, unverified login আর forgot-password এর পর বসে। */
export async function setOtpFlow(email: string, reason: OtpFlowReason) {
  (await cookies()).set(OTP_FLOW_COOKIE, `${reason}:${email}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: OTP_FLOW_TTL_SEC,
  });
}

/** Verify বা reset শেষ হলে মুছি, যাতে back button এ আবার OTP page না আসে। */
export async function clearOtpFlow() {
  (await cookies()).delete(OTP_FLOW_COOKIE);
}

/** Server action এ বর্তমান OTP flow পড়ার জন্য (reason আর email client এর কথায় বিশ্বাস না করে cookie থেকে নিই)। */
export async function getOtpFlow() {
  return parseOtpFlow((await cookies()).get(OTP_FLOW_COOKIE)?.value);
}
