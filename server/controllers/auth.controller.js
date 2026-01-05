const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Register (use once to create admin)
 */
exports.register = async (req, res) => {
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

    /* ---------- BASIC CHECK ---------- */
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    /* ---------- STUDENT VALIDATION ---------- */
    if (role === "student") {
      if (!name || !college || !year || !batch) {
        return res.status(400).json({
          message:
            "Student must have name, college, year, and batch"
        });
      }
    }

    /* ---------- CHECK EXISTING USER ---------- */
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    /* ---------- HASH PASSWORD ---------- */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ---------- CREATE USER ---------- */
    const user = await User.create({
      email,
      password: hashedPassword,
      role,

      // student-only fields
      name: role === "student" ? name : undefined,
      college: role === "student" ? college : undefined,
      year: role === "student" ? year : undefined,
      batch: role === "student" ? batch : undefined,

      // always empty on creation
      course: [],
      mcqs: [],
      regNo,
      phNo
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      role: user.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error"
    });
  }
};
/**
 * Login (Admin + Student)
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 🔍 Fetch user from DB
    console.log("dshasjfbdsj");
    
    const user = await User.findOne({ email });
    console.log(user);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔐 Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🎟 Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      "super_secret_key_123",
      { expiresIn: "1d" }
    );

    // ✅ SEND userId ALSO
    res.json({
      token,
      role: user.role,
      userId: user._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

