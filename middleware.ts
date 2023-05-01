import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import api from "./api";

export async function middleware(request: NextRequest) {
  const Cookie = request.headers.get("Cookie");

  if (Cookie) {
    const { data } = await api.session.show({
      headers: {
        Cookie,
      },
    });

    if (data) {
      return NextResponse.next();
    }
  }
  const url = request.nextUrl.clone();

  url.pathname = "/login";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/app/:path*",
};
