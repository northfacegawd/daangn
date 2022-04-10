import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    body: { answer },
    session: { user },
  } = req;
  try {
    const post = await client.post.findUnique({
      where: {
        id: +id.toString(),
      },
      select: {
        id: true,
      },
    });
    if (!post) {
      return res.status(404).json({ ok: false, error: "NOT_FOUND_POST" });
    }
    await client.answer.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: +id.toString(),
          },
        },
        answer,
      },
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, error });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
