import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import nodemailer from "nodemailer";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(10000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: { ...user },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MESSAGE_SERVICE_SID,
      to: `+82${phone}`,
      body: `Your login token is ${payload}`,
    });
    console.log(message);
  } else if (email) {
    const sendEmail = await transport.sendMail({
      from: "carrotmarket.services@gmail.com",
      to: email,
      subject: "Your Carrot Market Verification Email",
      text: `Your login token is ${payload}`,
      html: `<strong>Your login token is ${payload}</strong>`,
    });
    console.log(sendEmail);
  }

  return res.status(200).json({ ok: true });
}

export default withHandler("POST", handler);
