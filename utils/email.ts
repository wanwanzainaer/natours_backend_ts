import nodemailer from 'nodemailer';

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
}) => {
  const opt = {
    host: process.env.EMAIL_HOST!,
    port: process.env.EMAIL_PORT!,
    auth: {
      user: process.env.EMAIL_USERNAME!,
      password: process.env.EMAIL_PASSWORD!,
    },
  };
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 0,
    auth: {
      user: process.env.EMAIL_USERNAME!,
      pass: process.env.EMAIL_PASSWORD!,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Jonas Schmedtmann <hello@jona.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};
