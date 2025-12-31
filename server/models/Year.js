// models/Course.js
const mongoose = require("mongoose");

const YearSchema = new mongoose.Schema({
  Campusname: String,
  Year : Number
});

module.exports = mongoose.model("Year", YearSchema);