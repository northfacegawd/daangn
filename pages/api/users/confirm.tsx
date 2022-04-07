import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;
  const fountToken = await client.token.findUnique({
    where: {
      payload: token,
    },
    include: { user: true },
  });
  if (!fountToken) return res.status(404).json({ ok: false });
  req.session.user = {
    id: fountToken.userId,
  };
  await req.session.save();
  await client.token.deleteMany({
    where: {
      userId: fountToken.userId,
    },
  });
  return res.status(200).json({ ok: true });
}

export default withApiSession(withHandler("POST", handler));
