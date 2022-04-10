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
    const alreadyExists = await client.wondering.findFirst({
      where: {
        userId: user?.id,
        postId: +id.toString(),
      },
    });
    if (alreadyExists) {
      await client.wondering.delete({
        where: {
          id: alreadyExists.id,
        },
      });
    } else {
      await client.wondering.create({
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
