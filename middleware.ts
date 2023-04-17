import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const Cookie = request.headers.get("Cookie");

  if (Cookie) {
    const response = await fetch("http://127.0.0.1:3333/session", {
      method: "GET",
      headers: {
        Cookie,
        Accept: "application/json",
      },
    });

    const json = await response.json();

    if (typeof json.data === "object" && json.data !== null) {
      return NextResponse.next();
    }
  }

  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/app/:path*",
};
