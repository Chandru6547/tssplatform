const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
};

exports.getCourses = async (req, res) => {
  try {
    console.log("Fetching courses");

    const { studentId } = req.body;

    // ✅ No studentId → return ALL courses (admin / general)
    if (!studentId) {
      const courses = await Course.find();
      return res.json(courses);
    }

    const user = await User.findById(studentId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ If NOT student → return ALL courses
    if (user.role !== "student") {
      const courses = await Course.find();
      return res.json(courses);
    }

    // 🎓 Student → return only assigned courses
    const courseObjectIds = user.course.map(
      id => new mongoose.Types.ObjectId(id)
    );

    const courses = await Course.find({
      _id: { $in: courseObjectIds }
    });

    res.json(courses);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

