import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  try {
    const product = await client.product.findUnique({
      where: {
        id: +id.toString(),
      },
      select: {
        id: true,
      },
    });
    if (!product) {
      return res.status(404).json({ ok: false, error: "NOT_FOUND_PRODUCT" });
    }

    const alreadyExists = await client.fav.findFirst({
      where: {
        productId: +id.toString(),
        userId: user?.id,
      },
    });
    if (alreadyExists) {
      // delete
      await client.fav.delete({ where: { id: alreadyExists.id } });
    } else {
      // create
      await client.fav.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          product: {
            connect: {
              id: +id.toString(),
            },
          },
        },
      });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, error });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
