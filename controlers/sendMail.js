const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

function sendMail(toEmail, subject, content) {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: toEmail,
    subject: subject,
    html: content,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error Occures", err);
    } else {
      console.log("Email Sent", info.response);
    }
  });
}

module.exports = { sendMail };
