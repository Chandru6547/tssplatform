const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendMail = require("../utils/mail");
const logger = require("../utils/logger");

exports.createAdmin = async (req, res) => {
  logger.info("createAdmin API called");
  const { email } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // 🔐 Generate temp password
    const tempPassword = crypto.randomBytes(4).toString("hex");
    logger.info("Temporary password generated: " + tempPassword);
    
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

    logger.success("Admin created and email sent successfully");
    res.json({ message: "Admin created & email sent" });
  } catch (err) {
    logger.error("Error in createAdmin: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createStudent = async (req, res) => {
  logger.info("createStudent API called");
  const { email, college, year, batch, course, password } = req.body;

  try {
    // 🔍 Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // 🔐 Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString("hex") || password;
    logger.info("Temporary password generated: " + tempPassword);
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

    logger.success("Student created successfully");
    res.json({ message: "Student created & email sent" });
  } catch (err) {
    logger.error("Error in createStudent: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.findNotCreatedStudents = async (req, res) => {
  logger.info("findNotCreatedStudents API called");

  const { emails } = req.body;

  try {
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        message: "Emails array is required"
      });
    }

    /* ---------- EMAIL REGEX ---------- */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const normalized = emails.map(e => e?.trim().toLowerCase());

    /* ---------- INVALID EMAILS ---------- */
    const invalidEmails = normalized.filter(
      email => !emailRegex.test(email)
    );

    /* ---------- VALID EMAILS ---------- */
    const validEmails = normalized.filter(
      email => emailRegex.test(email)
    );

    /* ---------- REMOVE DUPLICATES ---------- */
    const uniqueValidEmails = [...new Set(validEmails)];

    /* ---------- FIND EXISTING USERS ---------- */
    const existingUsers = await User.find(
      { email: { $in: uniqueValidEmails } },
      { email: 1, _id: 0 }
    );

    const existingEmails = existingUsers.map(u => u.email);

    /* ---------- NOT CREATED ---------- */
    const notCreatedEmails = uniqueValidEmails.filter(
      email => !existingEmails.includes(email)
    );

    res.json({
      totalGiven: emails.length,              // 267
      invalidCount: invalidEmails.length,
      invalidEmails,

      validUniqueCount: uniqueValidEmails.length,
      existingCount: existingEmails.length,
      existingEmails,

      notCreatedCount: notCreatedEmails.length,
      notCreatedEmails
    });

  } catch (err) {
    logger.error("Error in findNotCreatedStudents: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.bulkCreateStudents = async (req, res) => {
  logger.info("bulkCreateStudents API called");

  const { students } = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({
      message: "Students array is required"
    });
  }

  const created = [];
  const skipped = [];
  const errors = [];

  try {
    for (const student of students) {
      const { email, college, year, batch, course, password } = student;

      if (!email || !college || !year || !batch) {
        errors.push({
          email,
          reason: "Missing required fields"
        });
        continue;
      }

      // 🔍 Check existing user
      const exists = await User.findOne({ email });
      if (exists) {
        skipped.push({
          email,
          reason: "Student already exists"
        });
        continue;
      }

      // 🔐 Generate temporary password
      const tempPassword = password || crypto.randomBytes(4).toString("hex");
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // 👨‍🎓 Create student
      await User.create({
        email,
        password: hashedPassword,
        role: "student",
        college,
        year,
        batch,
        course
      });

      created.push({
        email,
        tempPassword
      });
    }

    logger.success("Bulk student upload completed");

    res.json({
      message: "Bulk student upload completed",
      summary: {
        total: students.length,
        created: created.length,
        skipped: skipped.length,
        errors: errors.length
      },
      created,
      skipped,
      errors
    });
  } catch (err) {
    logger.error("Error in bulkCreateStudents: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};



exports.bulkDeleteStudentsByEmail = async (req, res) => {
  logger.info("bulkDeleteStudentsByEmail API called");

  const { emails } = req.body;

  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({
      message: "Emails array is required"
    });
  }

  try {
    // 🔍 Find matching students
    const students = await User.find({
      email: { $in: emails },
      role: "student"
    });

    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found for given emails"
      });
    }

    // ❌ Delete students
    const result = await User.deleteMany({
      email: { $in: emails },
      role: "student"
    });

    const deletedEmails = students.map((s) => s.email);

    logger.success(`Bulk deleted ${result.deletedCount} students`);

    res.json({
      message: "Bulk student deletion completed",
      summary: {
        requested: emails.length,
        deleted: result.deletedCount,
        notFound: emails.length - result.deletedCount
      },
      deletedEmails
    });
  } catch (err) {
    logger.error("Error in bulkDeleteStudentsByEmail: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};
