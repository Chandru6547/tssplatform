const mongoose = require("mongoose");

const curriculumSchema = new mongoose.Schema(
  {
    college: String,
    year: Number,
    batch: String,
    course: [],
    mcqs: [],
    assignments: [],
  },
);

module.exports = mongoose.model("Curriculum", curriculumSchema);