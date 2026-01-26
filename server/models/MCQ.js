const mongoose = require("mongoose");

/* ---------- QUESTION SUB-SCHEMA ---------- */
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  optionA: {
    type: String,
    required: true
  },
  optionB: {
    type: String,
    required: true
  },
  optionC: {
    type: String,
    required: true
  },
  optionD: {
    type: String,
    required: true
  },
  correctOption: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  },
  explanation: {
    type: String
  },
  mark: {
    type: Number,
    default: 1
  }
});

/* ---------- MCQ SCHEMA ---------- */
const MCQSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    questions: {
      type: [QuestionSchema],
      required: true
    }
  },
  { timestamps: true },
  { duration: Number } // duration in minutes
);

module.exports = mongoose.model("MCQ", MCQSchema);
