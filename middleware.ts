import { getIronSession } from "iron-session/edge";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ironSessionConfig } from "./iron-session-config";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/app")) {
    const res = NextResponse.next();

    const session = await getIronSession(req, res, ironSessionConfig);

    if (session.token) {
      return NextResponse.next();
    }

    const url = req.nextUrl.clone();

    url.pathname = "/login";

    return NextResponse.redirect(url);
  }

  if (req.nextUrl.pathname.startsWith("/api")) {
    if (
      req.nextUrl.pathname.startsWith("/api/session") &&
      (req.method === "POST" || req.method === "DELETE")
    ) {
      return NextResponse.next();
    }

    const session = await getIronSession(
      req,
      NextResponse.next(),
      ironSessionConfig
    );

    const token = session.token;

    const url = req.url.match(/\/api\/(.*)/)![1];

    const response = await fetch(
      new URL(url, process.env.NEXT_PUBLIC_API_URL),
      {
        method: req.method,
        headers: {
          ...req.headers,
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: req.method === "GET" ? undefined : await req.blob(),
      }
    );

    try {
      const data = await response.json();

      console.log(response.status);

      return NextResponse.json(data, {
        headers: {
          ...response.headers,
        },
        status: response.status,
        url: response.url,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({});
    }
  }

  return NextResponse.next();
}
