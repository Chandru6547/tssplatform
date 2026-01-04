// controllers/userMcq.controller.js
const User = require("../models/User");

exports.addMcq = async (req, res) => {
  const { email, mcq } = req.body;
  // mcq can be mcqId, score object, or anything

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.mcqs.push(mcq);
    await user.save();

    res.json({
      message: "MCQ added successfully",
      mcqs: user.mcqs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};