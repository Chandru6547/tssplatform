const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

/* =====================================================
   REGISTER
===================================================== */
exports.register = async (req, res) => {
  logger.info("Register API called");

  try {
    const {
      email,
      password,
      role = "user",
      name,
      college,
      year,
      batch,
      regNo,
      phNo
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    if (role === "student") {
      if (!name || !college || !year || !batch) {
        return res.status(400).json({
          message: "Student must have name, college, year, and batch"
        });
      }
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      name: role === "student" ? name : undefined,
      college: role === "student" ? college : undefined,
      year: role === "student" ? year : undefined,
      batch: role === "student" ? batch : undefined,
      course: [],
      mcqs: [],
      assignments: [],
      regNo,
      phNo
    });

    logger.success("User registered successfully");

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      role: user.role
    });
  } catch (err) {
    logger.error(`Register failed: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   LOGIN
===================================================== */
exports.login = async (req, res) => {
  logger.info("Login API called");

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      "super_secret_key_123",
      { expiresIn: "1d" }
    );

    logger.success("Login successful");

    res.json({
      token,
      role: user.role,
      userId: user._id
    });
  } catch (err) {
    logger.error(`Login failed: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.requestPasswordReset = async (req, res) => {
  logger.info("Password reset request API called");

  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // ❗ Do not expose user existence
    if (!user) {
      return res.json({
        message: "If the email exists, a reset link has been sent"
      });
    }

    /* ---------- GENERATE RESET TOKEN ---------- */
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    /* ---------- RESET LINK ---------- */
    const resetLink = `https://platform.teamtechsign.in/reset-password/${resetToken}`;
    logger.info(`Generated reset link: ${resetLink}`);

    /* ---------- BREVO SMTP ---------- */
       const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: "a0835b001@smtp-brevo.com",
          pass: "bskQbz5SggUfSJT"
        } 
      });
    /* ---------- EMAIL TEMPLATE ---------- */
    const mailOptions = {
      from: `"TSS Student Hub" <a0840f001@smtp-brevo.com>`,
      to: "chandruvasan06032003@gmail.com",
      subject: "🔐 Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd;">
          <h2 style="color:#111827;">Password Reset Request</h2>
          <p>You requested to reset your password.</p>
          <p>Click the button below to reset it. This link is valid for <b>15 minutes</b>.</p>

          <a href="${resetLink}"
             style="display:inline-block; margin-top:20px; padding:12px 22px;
             background:#2563eb; color:#ffffff; text-decoration:none;
             border-radius:6px;">
            Reset Password
          </a>

          <p style="margin-top:30px; color:#6b7280;">
            If you didn’t request this, you can safely ignore this email.
          </p>

          <p style="margin-top:10px;">
            — TSS Student Hub Team
          </p>
        </div>
      `
    };

   let mailres =  await transporter.sendMail(mailOptions);
    console.log(mailres);
    
    logger.success("Password reset email sent successfully");

    res.json({
      message: "Password reset link sent to email"
    });
  } catch (err) {
    logger.error(`Password reset request failed: ${err.message}`);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   RESET PASSWORD USING TOKEN
===================================================== */
exports.resetPassword = async (req, res) => {
  logger.info("Reset password API called");

  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required"
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    logger.success("Password reset successful");

    res.json({
      message: "Password reset successful"
    });
  } catch (err) {
    logger.error(`Reset password failed: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
