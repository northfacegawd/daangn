import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    session: { user },
  } = req;
  try {
    let stream = await client.stream.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        messages: {
          select: {
            id: true,
            message: true,
            user: {
              select: {
                avatar: true,
                id: true,
              },
            },
          },
        },
      },
    });
    if (!stream) {
      return res.status(404).json({ ok: false, error: "NOT_FOUND_STREAM" });
    }
    const isOwner = stream.userId === user?.id;
    if (!isOwner) {
      stream = Object.fromEntries(
        Object.entries(stream).filter(
          ([key]) => !["cloudflareUrl", "cloudflareKey"].includes(key)
        )
      ) as any;
    }
    return res.status(200).json({ ok: true, stream });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, error });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
