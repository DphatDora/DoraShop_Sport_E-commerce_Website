const nodemailer = require("nodemailer");
require("dotenv").config();

// Tạo transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"Dora Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    });
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Cannot send email");
  }
};

module.exports = { sendMail };
