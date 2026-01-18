const User = require("../models/User");

module.exports.getUser = async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.getStudentByEmail = async(req, res) => {
  const { email } = req.body;

  try {
    const student = await User.findOne({ email, role: "student" }).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.getStudentName = async (studentId) => {
  if (!studentId) return null; 
    const student = await User.findById(studentId).select("name");
    return student ? student.name : null;
};

module.exports.getStudentsByCollegeYearBatch = async (req, res) => {
  const { college, year, batch } = req.query;

  try {
    const query = { role: "student" };
    if (college) query.college = college;
    if (year) query.year = parseInt(year);
    if (batch) query.batch = batch;

    const students = await User.find(query).select("-password");
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports.getStudentsByCollegeYearBatch