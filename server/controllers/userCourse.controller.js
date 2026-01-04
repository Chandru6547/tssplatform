// controllers/userCourse.controller.js
const User = require("../models/User");

exports.addCourse = async (req, res) => {
  const { email, course } = req.body; 
  // course can be string or object

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent duplicate
    if (user.course.includes(course)) {
      return res.status(400).json({ message: "Course already exists" });
    }

    user.course.push(course);
    await user.save();

    res.json({
      message: "Course added successfully",
      course: user.course
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
