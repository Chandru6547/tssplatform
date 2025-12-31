const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendMail = require("../utils/mail");

exports.createAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // 🔐 Generate temp password
    const tempPassword = crypto.randomBytes(4).toString("hex");
    console.log(tempPassword);
    
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await User.create({
      email,
      password: hashedPassword,
      role: "admin"
    });

    // 📧 Send email
    await sendMail(
      email,
      "Your Admin Access",
      `
        <h3>Admin Account Created</h3>
        <p>Email: <b>${email}</b></p>
        <p>Temporary Password: <b>${tempPassword}</b></p>
        <p>Please login and change your password immediately.</p>
      `
    );

    res.json({ message: "Admin created & email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createStudent = async (req, res) => {
  const { email, college, year, batch, course } = req.body;

  try {
    // 🔍 Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // 🔐 Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString("hex");
    console.log(tempPassword);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 👨‍🎓 Create student (student-only fields added here)
    await User.create({
      email,
      password: hashedPassword,
      role: "student",

      // ✅ student-only fields
      college,
      year,
      batch,
      course
    });

    res.json({ message: "Student created & email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

