import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { question },
    session: { user },
  } = req;
  try {
    if (req.method === "POST") {
      const post = await client.post.create({
        data: {
          question,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });
      return res.status(200).json({ ok: true, post });
    }
    if (req.method === "GET") {
      const posts = await client.post.findMany({
        include: {
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              answers: true,
              wonderings: true,
            },
          },
        },
      });
      res.json({
        ok: true,
        posts,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, error });
  }
}

export default withApiSession(
  withHandler({ methods: ["POST", "GET"], handler })
);
