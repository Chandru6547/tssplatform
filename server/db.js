const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://ceo_db_user:uRfgiaD03QwN0R4B@studentshub.ux4ezvx.mongodb.net/?appName=StudentsHub");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
