import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    body: { name, price, description },
  } = req;
  try {
    if (req.method === "POST") {
      const stream = await client.stream.create({
        data: {
          name,
          price,
          description,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      return res.status(200).json({ ok: true, stream });
    }
    if (req.method === "GET") {
      const streams = await client.stream.findMany();
      return res.status(200).json({ ok: true, streams });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, error });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
