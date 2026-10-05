const nodemailer = require("nodemailer");

// Clean spaces often included in Gmail App Passwords
const emailPassword = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

// Gmail transport configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: emailPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Gmail SMTP connection failed:", error.message);
  } else {
    console.log("Gmail SMTP server is ready to send emails");
  }
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"ResearchHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || (html ? html.replace(/<[^>]*>?/gm, "") : ""),
      html,
    });
    console.log(`[Email Sent] Message ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Gmail sending failed:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
