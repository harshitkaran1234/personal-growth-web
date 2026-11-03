import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "pg_session";
const PUBLIC_PATHS = ["/login", "/logout"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedIn = request.cookies.has(SESSION_COOKIE);
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!signedIn && !isPublic) return NextResponse.redirect(new URL("/login", request.url));
  if (signedIn && pathname === "/login") return NextResponse.redirect(new URL("/planner", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
