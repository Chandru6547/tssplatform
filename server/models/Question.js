// models/Question.js
const mongoose = require("mongoose");

const TestcaseSchema = new mongoose.Schema({
  input: String,
  output: String
});

const QuestionSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  sampleTestcases: [TestcaseSchema],
  hiddenTestcases: [TestcaseSchema]
});

module.exports = mongoose.model("Question", QuestionSchema);
