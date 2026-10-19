import { cookies } from "next/headers";
import { CURRENCY_COOKIE, LANG_COOKIE, PREF_COOKIE_MAX_AGE } from "@/lib/constants";

// session.ts এর মতোই: cookie পড়া/লেখা শুধু server এ। Client এ Server Action দিয়ে আসে।
const opts = { sameSite: "lax", path: "/", maxAge: PREF_COOKIE_MAX_AGE } as const;

export async function getLanguageCookie() {
  return (await cookies()).get(LANG_COOKIE)?.value;
}
export async function setLanguageCookie(code: string) {
  (await cookies()).set(LANG_COOKIE, code, opts);
}

export async function getCurrencyCookie() {
  return (await cookies()).get(CURRENCY_COOKIE)?.value;
}
export async function setCurrencyCookie(code: string) {
  (await cookies()).set(CURRENCY_COOKIE, code.toUpperCase(), opts);
}
