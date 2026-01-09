// controllers/userCourse.controller.js
const User = require("../models/User");
const logger = require("../utils/logger");

exports.addCourse = async (req, res) => {
  logger.info("addCourse API called");
  const { email, course } = req.body; 
  // course can be string or object

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.error("User not found in addCourse");
      return res.status(404).json({ message: "User not found" });
    }

    // prevent duplicate
    if (user.course.includes(course)) {
      logger.error("Course already exists in addCourse");
      return res.status(400).json({ message: "Course already exists" });
    }

    user.course.push(course);
    await user.save();

    logger.success("Course added successfully");
    res.json({
      message: "Course added successfully",
      course: user.course
    });
  } catch (err) {
    logger.error("Error in addCourse: " + err.message);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
