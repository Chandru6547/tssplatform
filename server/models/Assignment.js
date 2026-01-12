const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    dueDate: {
      type: Date,
      required: true
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
