import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export {default} from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (
    token &&
    (request.nextUrl.pathname === "/sign-in" ||
      request.nextUrl.pathname === "/sign-up" ||
      request.nextUrl.pathname === "/verify" ||
      request.nextUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if(!token && request.nextUrl.pathname.startsWith("/dashboard")){
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/sign-up", "/verify","/" , "/dashboard/:path*"],
};
