const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const logger = require("../utils/logger");

exports.createCourse = async (req, res) => {
  logger.info("createCourse API called");
  try {
    const course = await Course.create(req.body);
    logger.success("Course created successfully");
    res.status(201).json(course);
  } catch (err) {
    logger.error("Error in createCourse: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCourses = async (req, res) => {
  logger.info("getCourses API called");
  try {
    console.log("Fetching courses");

    const { studentId } = req.body;

    // ✅ No studentId → return ALL courses (admin / general)
    if (!studentId) {
      const courses = await Course.find();
      logger.success("All courses retrieved successfully");
      return res.json(courses);
    }

    const user = await User.findById(studentId);

    if (!user) {
      logger.error("User not found for getCourses");
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ If NOT student → return ALL courses
    if (user.role !== "student") {
      const courses = await Course.find();
      logger.success("All courses retrieved for non-student");
      return res.json(courses);
    }

    // 🎓 Student → return only assigned courses
    const courseObjectIds = user.course.map(
      id => new mongoose.Types.ObjectId(id)
    );

    const courses = await Course.find({
      _id: { $in: courseObjectIds }
    });

    logger.success("Student courses retrieved successfully");
    res.json(courses);

  } catch (err) {
    logger.error("Error in getCourses: " + err.message);
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

