import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const products = await client.product.findMany({
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
      });
      return res.status(200).json({ ok: true, products });
    }
    if (req.method === "POST") {
      const {
        body: { name, price, description, photoId },
        session: { user },
      } = req;
      const product = await client.product.create({
        data: {
          name,
          price,
          description,
          image: photoId,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      return res.status(200).json({
        ok: true,
        product,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
