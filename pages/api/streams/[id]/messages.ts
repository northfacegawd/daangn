import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    query: { id },
    body: { message },
  } = req;
  try {
    const stream = await client.stream.findUnique({
      where: {
        id: +id.toString(),
      },
      select: { id: true },
    });
    if (!stream) {
      return res.status(404).json({ ok: false, error: "NOT_FOUND_STREAM" });
    }
    const createdMessage = await client.message.create({
      data: {
        message,
        stream: {
          connect: {
            id: +id.toString(),
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    return res.status(200).json({ ok: true, message: createdMessage });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, error });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
