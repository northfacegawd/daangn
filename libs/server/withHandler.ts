import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type Method = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

interface WithHandlerConfig {
  methods: Method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  authorization?: boolean;
}

export default function withHandler({
  handler,
  methods,
  authorization = true,
}: WithHandlerConfig) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method && !methods.includes(req.method as Method)) {
      return res.status(405).end();
    }
    if (authorization && !req.session.user) {
      return res.status(401).json({ ok: false, error: "UNAUTHENTICATED_USER" });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
}
