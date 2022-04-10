import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const profile = await client.user.findUnique({
        where: { id: req.session.user?.id },
      });
      return res.status(200).json({
        ok: true,
        profile,
      });
    }
    if (req.method === "POST") {
      const {
        session: { user },
        body: { email, phone, name },
      } = req;
      const currentUser = await client.user.findUnique({
        where: {
          id: user?.id,
        },
      });
      if (email && email !== currentUser?.email) {
        const alreadyExists = Boolean(
          await client.user.findUnique({
            where: {
              email,
            },
            select: {
              id: true,
            },
          })
        );
        if (alreadyExists) {
          return res.status(409).json({
            ok: false,
            error: "EMAIL_ALREADY_TAKEN",
            errorField: "email",
          });
        }
        await client.user.update({
          where: {
            id: user?.id,
          },
          data: {
            email,
          },
        });
        res.json({ ok: true });
      }
      if (phone && phone !== currentUser?.phone) {
        const alreadyExists = Boolean(
          await client.user.findUnique({
            where: {
              phone,
            },
            select: {
              id: true,
            },
          })
        );
        if (alreadyExists) {
          return res.status(409).json({
            ok: false,
            error: "PHONE_ALREADY_IN_USE",
            errorField: "phone",
          });
        }
        await client.user.update({
          where: {
            id: user?.id,
          },
          data: {
            phone,
          },
        });
        res.json({ ok: true });
      }
      if (name) {
        await client.user.update({
          where: {
            id: user?.id,
          },
          data: {
            name,
          },
        });
      }
      res.status(200).json({ ok: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, error });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
