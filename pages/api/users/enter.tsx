import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "POST":
      res.status(200).json({ success: true });
    default:
      res.status(404).end();
  }
};

export default handler;
