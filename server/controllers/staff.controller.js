const User = require("../models/User");
const logger = require("../utils/logger");

exports.addAssignmenttoStaff = async (req, res) => {
  try {
    const { college, assignmentId } = req.body;

    const staffMembers = await User.find({ college, role: "staff" });

    for (const staff of staffMembers) {
      if (!staff.assignments.includes(assignmentId)) {
        staff.assignments.push(assignmentId);
        await staff.save();
      }
    }

    res.status(200).json({
      message: "Assignment added to all staff",
      count: staffMembers.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.addCoursetoStaff = async (req, res) => {
  try {
    const { college, course } = req.body;

    const staffMembers = await User.find({ college, role: "staff" });

    for (const staff of staffMembers) {
      if (!staff.course.includes(course)) {
        staff.course.push(course);
        await staff.save();
      }
    }

    res.status(200).json({
      message: "Course added to all staff",
      count: staffMembers.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.addMcqtoStaff = async (req, res) => {
  try {
    const { college, mcq } = req.body;

    const staffMembers = await User.find({ college, role: "staff" });

    for (const staff of staffMembers) {
      if (!staff.mcqs.includes(mcq)) {
        staff.mcqs.push(mcq);
        await staff.save();
      }
    }

    res.status(200).json({
      message: "MCQ added to all staff",
      count: staffMembers.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStaffById = async (req, res) => {
  try {
    logger.info("getStaffById API called");
    console.log(req.params);
    
    const staff = await User.findById(req.params.id).lean();
    console.log(staff);
    
    if (!staff || staff.role !== "staff") {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.json(staff);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};