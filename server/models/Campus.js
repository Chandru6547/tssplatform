// models/Campus.js
const mongoose = require("mongoose");

const CampusSchema = new mongoose.Schema({
  college: String
});

module.exports = mongoose.model("Campus", CampusSchema);