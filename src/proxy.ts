// import { NextResponse, type NextRequest } from "next/server";
// import { AUTH_PAGES, OTP_FLOW_COOKIE, PAYMENT_COOKIE, PROTECTED_AREAS, SESSION_COOKIE, parseOtpFlow, roleHome, type OtpFlowReason } from "./lib/constants";
// import { decodeJwt, isExpired } from "./lib/jwt";

// // OTP এর page গুলো: কোন flow থেকে ঢোকা যাবে, আর flow না থাকলে কোথায় ফেরত যাবে।
// // "আগের route" URL টাইপ করলে server এ জানা যায় না, তাই flow না থাকলে এই fallback এ পাঠাই।

// // /verify-otp এ ঢুকতে পারবে signup আর forgot-password দুই flow ই। /reset-password এ শুধু OTP verify হওয়ার পর।
// const OTP_PAGES: Record<string, { reasons: OtpFlowReason[]; fallback: string }> = {
//   "/verify-otp": { reasons: ["registration", "forgot-password"], fallback: "/login" },
//   "/reset-password": { reasons: ["reset-password"], fallback: "/forgot-password" },
// };

// /**
//  * Route guard (Next.js 16 এ middleware এর নাম proxy)। এই ফাইল src/proxy.ts এই থাকতে হবে।
//  * এখানে token এর signature যাচাই হয় না। সেটা Go backend করে। এখানে শুধু UI এর পথ ঠিক রাখা হয়।
//  */
// export function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const raw = req.cookies.get(SESSION_COOKIE)?.value;
//   const decoded = raw ? decodeJwt(raw) : null;
//   // মেয়াদ শেষ, নষ্ট, বা unverified token হলে logged out ধরি
//   const claims = decoded && !isExpired(decoded) && decoded.is_verified ? decoded : null;
//   const role = claims?.role?.toLowerCase();
//   const stale = !!raw && !claims; // এই cookie মুছে দেব

//   const finish = (res: NextResponse) => {
//     if (stale) res.cookies.delete(SESSION_COOKIE);
//     return res;
//   };
//   const go = (path: string) => finish(NextResponse.redirect(new URL(path, req.url)));

//   // 1) /admin, /manager, /user: শুধু নিজের role
//   const area = Object.keys(PROTECTED_AREAS).find((p) => pathname === p || pathname.startsWith(`${p}/`));
//   if (area) {
//     if (!claims) return go("/login");
//     if (role !== PROTECTED_AREAS[area]) return go(roleHome(role)); // ভুল dashboard এ গেলে নিজের টায় ফেরত
//     return finish(NextResponse.next());
//   }

//   // 2) login/register/OTP ইত্যাদি
//   if (AUTH_PAGES.includes(pathname)) {
//     // login করা user দের এসব page এ দরকার নেই
//     if (claims) return go(roleHome(role));

//     // /verify-otp আর /reset-password: সঠিক flow cookie আর URL এ সেই email থাকতেই হবে
//     const otpPage = OTP_PAGES[pathname];
//     if (otpPage) {
//       const flow = parseOtpFlow(req.cookies.get(OTP_FLOW_COOKIE)?.value);
//       if (!flow || !otpPage.reasons.includes(flow.reason)) return go(otpPage.fallback);
//       // flow ঠিক আছে কিন্তু ?email= নেই বা অন্য email, তাই flow এর email বসিয়ে দিই (বাকি query, যেমন reason, থাকে)
//       if (req.nextUrl.searchParams.get("email") !== flow.email) {
//         const url = req.nextUrl.clone();
//         url.searchParams.set("email", flow.email);
//         return finish(NextResponse.redirect(url));
//       }
//     }
//     return finish(NextResponse.next());
//   }

//   // 3) /payment/*: শুধু backend থেকে redirect হয়ে আসলে ঢোকা যাবে
//   if (pathname.startsWith("/payment/")) {
//     if (!claims) return go("/login");
//     const site = req.headers.get("sec-fetch-site"); // none = URL টাইপ/bookmark, same-origin = আমাদের নিজের site থেকে
//     const hasPass = req.cookies.has(PAYMENT_COOKIE);
//     if (!hasPass && (site === "none" || site === "same-origin")) return go("/");
//     const res = finish(NextResponse.next());
//     if (!hasPass) {
//       // reload করলে যেন আটকে না যায়, তাই ১০ মিনিটের pass
//       res.cookies.set(PAYMENT_COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/payment", maxAge: 600 });
//     }
//     return res;
//   }

//   return finish(NextResponse.next());
// }

// // শুধু দরকারি route এ চলবে, তাই public page গুলো static ই থাকে।
// export const config = {
//   matcher: [
//     "/admin/:path*", "/manager/:path*", "/user/:path*",
//     "/login", "/register", "/verify-otp", "/forgot-password", "/reset-password",
//     "/payment/:path*",
//   ],
// };


import { NextResponse, type NextRequest } from "next/server";
import { AUTH_PAGES, OTP_FLOW_COOKIE, PAYMENT_COOKIE, PROTECTED_AREAS, SESSION_COOKIE, parseOtpFlow, roleHome, type OtpFlowReason } from "./lib/constants";
import { decodeJwt, isExpired } from "./lib/jwt";

// OTP এর page গুলো: কোন flow থেকে ঢোকা যাবে, আর flow না থাকলে কোথায় ফেরত যাবে।
// "আগের route" URL টাইপ করলে server এ জানা যায় না, তাই flow না থাকলে এই fallback এ পাঠাই।

// /verify-otp এ ঢুকতে পারবে signup আর forgot-password দুই flow ই। /reset-password এ শুধু OTP verify হওয়ার পর।
const OTP_PAGES: Record<string, { reasons: OtpFlowReason[]; fallback: string }> = {
  "/verify-otp": { reasons: ["registration", "forgot-password"], fallback: "/login" },
  "/reset-password": { reasons: ["reset-password"], fallback: "/forgot-password" },
};

/**
 * Route guard (Next.js 16 এ middleware এর নাম proxy)। এই ফাইল src/proxy.ts এই থাকতে হবে।
 * এখানে token এর signature যাচাই হয় না। সেটা Go backend করে। এখানে শুধু UI এর পথ ঠিক রাখা হয়।
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  const decoded = raw ? decodeJwt(raw) : null;
  // মেয়াদ শেষ, নষ্ট, বা unverified token হলে logged out ধরি
  const claims = decoded && !isExpired(decoded) && decoded.is_verified ? decoded : null;
  const role = claims?.role?.toLowerCase();
  const stale = !!raw && !claims; // এই cookie মুছে দেব

  const finish = (res: NextResponse) => {
    if (stale) res.cookies.delete(SESSION_COOKIE);
    return res;
  };
  const go = (path: string) => finish(NextResponse.redirect(new URL(path, req.url)));

  // 1) /admin, /manager, /user: শুধু নিজের role
  const area = Object.keys(PROTECTED_AREAS).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (area) {
    if (!claims) return go("/login");
    if (role !== PROTECTED_AREAS[area]) return go(roleHome(role)); // ভুল dashboard এ গেলে নিজের টায় ফেরত
    return finish(NextResponse.next());
  }

  // 1b) /profile: সব role এর জন্য, তবে login থাকতে হবে
  if (pathname === "/profile") {
    if (!claims) return go("/login");
    return finish(NextResponse.next());
  }

  // 2) login/register/OTP ইত্যাদি
  if (AUTH_PAGES.includes(pathname)) {
    // login করা user দের এসব page এ দরকার নেই
    if (claims) return go(roleHome(role));

    // /verify-otp আর /reset-password: সঠিক flow cookie আর URL এ সেই email থাকতেই হবে
    const otpPage = OTP_PAGES[pathname];
    if (otpPage) {
      const flow = parseOtpFlow(req.cookies.get(OTP_FLOW_COOKIE)?.value);
      if (!flow || !otpPage.reasons.includes(flow.reason)) return go(otpPage.fallback);
      // flow ঠিক আছে কিন্তু ?email= নেই বা অন্য email, তাই flow এর email বসিয়ে দিই (বাকি query, যেমন reason, থাকে)
      if (req.nextUrl.searchParams.get("email") !== flow.email) {
        const url = req.nextUrl.clone();
        url.searchParams.set("email", flow.email);
        return finish(NextResponse.redirect(url));
      }
    }
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
    "/admin/:path*", "/manager/:path*", "/user/:path*", "/profile",
    "/login", "/register", "/verify-otp", "/forgot-password", "/reset-password",
    "/payment/:path*",
  ],
};
