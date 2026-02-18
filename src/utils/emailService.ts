// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();

// export const sendEmail = async (to: string, subject: string, text: string) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Ticketing Tool" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     text,
//   });
// };

// utils/emailService.ts
import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string) => {
  console.log(" Preparing email to:", to);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Admin Panel" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    console.log(` Email SENT to: ${to}, MessageId: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error(" EMAIL ERROR:", error.response || error.message);
    return false;
  }
};
