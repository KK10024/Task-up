import nodemailer from 'nodemailer';


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
      console.error('Error sending email:', e);
    }
};