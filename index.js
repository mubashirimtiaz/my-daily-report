require('dotenv').config();
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');


(async () => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER_EMAIL,
      pass: process.env.MAIL_USER_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Mubashir" ${process.env.MAIL_USER_EMAIL}`,
    to: process.env.MAIL_TO, 
    subject: "Daily Report", // Subject line
    text: `
      Daily Report
    `, // plain text body
    html: "<b>Daily Report</b>", // html body
  });

})();