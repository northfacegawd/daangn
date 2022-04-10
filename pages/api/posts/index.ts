import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { question, latitude, longitude },
    session: { user },
  } = req;
  try {
    if (req.method === "POST") {
      const post = await client.post.create({
        data: {
          question,
          latitude,
          longitude,
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
      const { latitude, longitude } = req.query;
      const parsedLatitude = parseFloat(latitude.toString());
      const ParsedLongitude = parseFloat(longitude.toString());
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
        where: {
          // TODO - 검색 범위는 유저가 직접 정할 수 있도록 수정
          latitude: {
            gte: parsedLatitude - 0.01,
            lte: parsedLatitude + 0.01,
          },
          longitude: {
            gte: ParsedLongitude - 0.01,
            lte: ParsedLongitude + 0.01,
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
