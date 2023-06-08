import { IronSessionOptions } from "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    token?: string;
  }
}

export const ironSessionConfig: IronSessionOptions = {
  cookieName: "session",
  password: process.env.IRON_SESSION_PASSWORD,
  ttl: 60 * 60 * 24 * 7,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};
