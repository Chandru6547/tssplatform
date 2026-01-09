// controllers/userMcq.controller.js
const User = require("../models/User");
const logger = require("../utils/logger");

exports.addMcq = async (req, res) => {
  logger.info("addMcq API called");
  const { email, mcq } = req.body;
  // mcq can be mcqId, score object, or anything

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.error("User not found in addMcq");
      return res.status(404).json({ message: "User not found" });
    }

    user.mcqs.push(mcq);
    await user.save();

    logger.success("MCQ added successfully");
    res.json({
      message: "MCQ added successfully",
      mcqs: user.mcqs
    });
  } catch (err) {
    logger.error("Error in addMcq: " + err.message);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};