import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

interface CloudFlareStreamResponse {
  result: {
    uid: string;
    rtmps: { url: string; streamKey: string };
    created: string;
    modified: string;
    meta: { name: string };
    status: any;
    recording: {
      mode: string;
      requireSignedURLs: boolean;
      allowedOrigins: string[];
    };
  };
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: { user },
    body: { name, price, description },
  } = req;
  try {
    if (req.method === "POST") {
      const {
        result: {
          uid,
          rtmps: { streamKey, url },
        },
      }: CloudFlareStreamResponse = await (
        await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/stream/live_inputs`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
            },
            body: `{"meta": {"name":"${name}"},"recording": { "mode": "automatic", "timeoutSeconds": 10 }}`,
          }
        )
      ).json();
      const stream = await client.stream.create({
        data: {
          cloudflareId: uid,
          cloudflareKey: streamKey,
          cloudflareUrl: url,
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
      const streams = await client.stream.findMany({ take: 10, skip: 0 });
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
