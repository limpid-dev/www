import { withIronSessionApiRoute } from "iron-session/next";
import httpProxyMiddleware from "next-http-proxy-middleware";
import { ironSessionConfig } from "../../iron-session-config";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default withIronSessionApiRoute((req, res) => {
  const url = req.url!.match(/\/api\/(.*)/)![1];

  req.url = url;

  return httpProxyMiddleware(req, res, {
    target: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${req.session.token}`,
    },
  });
}, ironSessionConfig);
