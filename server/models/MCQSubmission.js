const mongoose = require("mongoose");

const MCQAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOption: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  },
  correctOption: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  mark: {
    type: Number,
    default: 1
  }
});

const MCQSubmissionSchema = new mongoose.Schema({
  mcqId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MCQ",
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  score: Number,
  totalMarks: Number,
  college: String,
    year: Number,
    batch: String,

  answers: [MCQAnswerSchema],

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("MCQSubmission", MCQSubmissionSchema);
