import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const product = await client.product.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  if (!product) {
    return res.status(404).json({ ok: false, error: "NOT_FOUND_PRODUCT" });
  }
  return res.status(200).json({ ok: true, product });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
