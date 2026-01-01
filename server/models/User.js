const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: String,
  college : String,
  year : Number,
  batch : String,
  course: [],
  mcqs: [],
  role: {
    type: String,
    enum: ["admin", "student", "user"],
    default: "user"
  }
});

module.exports = mongoose.model("User", userSchema);
