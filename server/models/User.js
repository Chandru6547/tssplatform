const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
    college: String,
    year: Number,
    batch: String,

    course: [],
    mcqs: [],
    assignments: [],

    regNo: String,
    phNo: String,

    role: {
      type: String,
      enum: ["admin", "student", "user", "staff"],
      default: "user"
    },

    /* ================= PASSWORD RESET ================= */
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
