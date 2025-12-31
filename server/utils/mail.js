const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "teamtechsign.in",   // ✅ EXACT from cPanel
  port: 465,                 // ✅ SSL port
  secure: true,              // ✅ MUST be true for 465
  auth: {
    user: "platform@teamtechsign.in",
    pass: "S.chandru6@" // 🔐 use env variable
  }
});

// Verify SMTP connection at startup
transporter.verify((err) => {
  if (err) {
    console.error("SMTP Error:", err);
  } else {
    console.log("✅ SMTP connection successful");
  }
});

module.exports = async function sendMail(to, subject, html) {
  return transporter.sendMail({
    from: `"Code Platform" <platform@teamtechsign.in>`,
    to,
    subject,
    html
  });
};
