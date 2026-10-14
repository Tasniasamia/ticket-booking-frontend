import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// TODO: role guard (/user, /manager, /admin) এখানে হবে। এখন শুধু pass-through।
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
