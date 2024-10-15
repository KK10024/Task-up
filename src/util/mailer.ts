import nodemailer from 'nodemailer';
import { AppError } from './AppError';


const transporter = nodemailer.createTransport({
    service: 'gmail', //이메일 서비스
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  export const sendMail = async (to: string, subject: string, text: string) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html:text, 
      };
  
      // 메일 전송
      await transporter.sendMail(mailOptions);
    } catch (e) {
      throw new AppError("이메일 전송 오류", 400);
    }
};