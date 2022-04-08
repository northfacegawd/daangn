import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

interface WithHandlerConfig {
  method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  authorization?: boolean;
}

export default function withHandler({
  handler,
  method,
  authorization = true,
}: WithHandlerConfig) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method !== method) {
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
