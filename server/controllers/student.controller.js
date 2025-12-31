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

module.exports.getStudentName = async (studentId) => {
  if (!studentId) return null; 
    const student = await User.findById(studentId).select("name");
    return student ? student.name : null;
};