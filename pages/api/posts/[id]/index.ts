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
    const post = await client.post.findUnique({
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
        answers: {
          select: {
            answer: true,
            id: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
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
    if (!post) {
      return res.status(404).json({ ok: false, error: "NOT_FOUND_POST" });
    }
    const isWondering = Boolean(
      await client.wondering.findFirst({
        where: {
          postId: +id.toString(),
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );
    return res.status(200).json({ ok: true, post, isWondering });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, error });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
