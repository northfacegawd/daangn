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
  // 해당 product와 관련된 products를 검색하는 로직
  const terms = product.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product.id,
        },
      },
    },
  });

  return res.status(200).json({ ok: true, product, relatedProducts });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
