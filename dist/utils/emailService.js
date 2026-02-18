"use strict";
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
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
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, text) => {
    console.log(" Preparing email to:", to);
    try {
        const transporter = nodemailer_1.default.createTransport({
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
    }
    catch (error) {
        console.error(" EMAIL ERROR:", error.response || error.message);
        return false;
    }
};
exports.sendEmail = sendEmail;
