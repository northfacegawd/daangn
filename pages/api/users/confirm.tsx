import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;
  const exists = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: { user: true },
  });
  if (!exists) return res.status(404).json({ ok: false });
  req.session.user = {
    id: exists.userId,
  };
  await req.session.save();
  return res.status(200).json({ ok: true });
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrot-session",
  password: process.env.SESSION_SECRET!,
});
