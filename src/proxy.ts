import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = { matcher: ["/admin/:path*"] };

export async function proxy(req: NextRequest) {
  // 로그인 페이지는 통과
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("benepick_admin")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET ?? "");
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}
