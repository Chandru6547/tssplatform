// models/Course.js
const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema({
  Campusname: String,
  Year : Number,
  batch : String
});

module.exports = mongoose.model("Batch", BatchSchema);