const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Register (use once to create admin)
 */
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login
 */
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

