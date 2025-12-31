// models/Course.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String
});

module.exports = mongoose.model("Course", CourseSchema);
