import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      body: { name, price, description },
      session: { user },
    } = req;
    const product = await client.product.create({
      data: {
        name,
        price,
        description,
        image: "xx",
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, error });
  }
}

export default withApiSession(withHandler({ method: "POST", handler }));
