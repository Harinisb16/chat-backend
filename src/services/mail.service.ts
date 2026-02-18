import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (to: string) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: "New message from Admin",
    text: "You have a new message. Please login.",
  });
};
