import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export interface CloudFlareResponse {
  result: {
    id: string;
    uploadURL: string;
  };
  result_info: string | null;
  success: boolean;
  errors: any[];
  messages: any[];
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response: CloudFlareResponse = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v2/direct_upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CF_TOKEN}`,
          },
        }
      )
    ).json();
    return res.json({ ok: true, ...response.result });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, error });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
