import { NextResponse, type NextRequest } from "next/server";
import { AUTH_PAGES, PAYMENT_COOKIE, PROTECTED_AREAS, SESSION_COOKIE, roleHome } from "./lib/constants";
import { decodeJwt, isExpired } from "./lib/jwt";

/**
 * Route guard (Next.js 16 এ middleware এর নাম proxy)। এই ফাইল src/proxy.ts এই থাকতে হবে।
 * এখানে token এর signature যাচাই হয় না। সেটা Go backend করে। এখানে শুধু UI এর পথ ঠিক রাখা হয়।
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  const decoded = raw ? decodeJwt(raw) : null;
  const claims = decoded && !isExpired(decoded) ? decoded : null; // মেয়াদ শেষ হলে logged out
  const role = claims?.role?.toLowerCase();
  const stale = !!raw && !claims; // নষ্ট বা মেয়াদোত্তীর্ণ cookie মুছে দেব

  //logout start
  const finish = (res: NextResponse) => {
    if (stale) res.cookies.delete(SESSION_COOKIE);
    return res;
  };
  const go = (path: string) => finish(NextResponse.redirect(new URL(path, req.url)));
  //logout end

  const verifyUrl = `/verify-otp?email=${encodeURIComponent(claims?.email ?? "")}`;

  // 1) /admin, /manager, /user: শুধু নিজের role
  const area = Object.keys(PROTECTED_AREAS).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (area) {
    if (!claims) return go("/login");  //claims hole login e ashbe. 
    if (!claims.is_verified) return go(verifyUrl);
    if (role !== PROTECTED_AREAS[area]) return go(roleHome(role)); // ভুল dashboard এ গেলে নিজের টায় ফেরত
    return finish(NextResponse.next());
  }

  // 2) login/register ইত্যাদি: login করা (verified) user দের দরকার নেই
  if (AUTH_PAGES.includes(pathname)) {
    if (claims?.is_verified) return go(roleHome(role));
    return finish(NextResponse.next());
  }

  // 3) /payment/*: শুধু backend থেকে redirect হয়ে আসলে ঢোকা যাবে
  if (pathname.startsWith("/payment/")) {
    if (!claims) return go("/login");
    const site = req.headers.get("sec-fetch-site"); // none = URL টাইপ/bookmark, same-origin = আমাদের নিজের site থেকে
    const hasPass = req.cookies.has(PAYMENT_COOKIE);
    if (!hasPass && (site === "none" || site === "same-origin")) return go("/");
    const res = finish(NextResponse.next());
    if (!hasPass) {
      // reload করলে যেন আটকে না যায়, তাই ১০ মিনিটের pass
      res.cookies.set(PAYMENT_COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/payment", maxAge: 600 });
    }
    return res;
  }

  return finish(NextResponse.next());
}

// শুধু দরকারি route এ চলবে, তাই public page গুলো static ই থাকে।
export const config = {
  matcher: [
    "/admin/:path*", "/manager/:path*", "/user/:path*",
    "/login", "/register", "/verify-otp", "/forgot-password", "/reset-password",
    "/payment/:path*",
  ],
};
