import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
  } = req;
  const sales = await client.sale.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        include: {
          _count: {
            select: { favs: true },
          },
        },
      },
    },
  });
  return res.status(200).json({
    ok: true,
    sales,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
