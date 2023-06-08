import { withIronSessionApiRoute } from "iron-session/next";
import { ironSessionConfig } from "../../iron-session-config";

export default withIronSessionApiRoute(async (req, res) => {
  if (req.method === "POST") {
    const response = await fetch(
      new URL("session", process.env.NEXT_PUBLIC_API_URL),
      {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const body = await response.json();

    if (response.ok) {
      req.session.token = body.data.token;

      await req.session.save();
    }

    return res.status(response.status).json(body);
  }
  if (req.method === "DELETE") {
    const response = await fetch(
      new URL("session", process.env.NEXT_PUBLIC_API_URL),
      {
        method: req.method,
        headers: {
          Authorization: `Bearer ${req.session.token}`,
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      req.session.destroy();
    }

    return res.status(response.status).end();
  }
}, ironSessionConfig);
