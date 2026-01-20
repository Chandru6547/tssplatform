const mongoose = require("mongoose");

const MCQAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  selectedOption: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: false
  },
  correctOption: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: false
  },
  isCorrect: {
    type: Boolean,
    required: false
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
    required: false
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  isTabSwitch : Boolean,
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
