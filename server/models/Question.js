// models/Question.js
const mongoose = require("mongoose");

/* ---------- TEST CASE ---------- */
const TestcaseSchema = new mongoose.Schema({
  input: String,
  output: String
});

/* ---------- PREDEFINED CODE ---------- */
const LanguageTemplateSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ["c", "cpp", "python", "java"],
    required: true
  },
  code: {
    type: String,
    required: true
  }
});

/* ---------- QUESTION ---------- */
const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
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

  /* ⭐ FLAG ⭐ */
  isPredefinedOnly: {
    type: Boolean,
    default: false
  },

  /* ⭐ PREDEFINED CODE PER LANGUAGE ⭐ */
  predefinedCode: [LanguageTemplateSchema],

  sampleTestcases: [TestcaseSchema],
  hiddenTestcases: [TestcaseSchema]
});

module.exports = mongoose.model("Question", QuestionSchema);
