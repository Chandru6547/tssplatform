const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  language: String,
  code: String, 
  studentId : String,
  verdict: String, // AC / WA / RE / TLE
  passed: Number,
  total: Number,
  questionId: String,
  batch: String,
  year: Number,
  college: String,
  results: [
    {
      input: String,
      expected: String,
      actual: String,
      status: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Submission", submissionSchema);
