const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    studentName: {
      type: String,
      required: true
    },

    rollNo: {
      type: String,
      required: true
    },

    batch: {
      type: String,
      required: true
    },

    problemsSolved: {
      type: Number,
      default: 0
    },

    solvedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
