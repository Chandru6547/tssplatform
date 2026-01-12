const Assignment = require("../models/Assignment");
const Question = require("../models/Question");
const User = require("../models/User");

/* ---------------- CREATE ASSIGNMENT ---------------- */
exports.createAssignment = async (req, res) => {
  try {
    const { name, description, dueDate, questions, user } = req.body;
    console.log('Assignement entered');
    

    if (!name || !description || !dueDate || !questions?.length) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Validate question IDs
    const validQuestions = await Question.find({
      _id: { $in: questions }
    });

    if (validQuestions.length !== questions.length) {
      return res.status(400).json({
        message: "Invalid question IDs provided"
      });
    }

    const assignment = await Assignment.create({
      name,
      description,
      dueDate,
      questions,
      createdBy: user
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create assignment" });
  }
};

/* ---------------- GET ALL ASSIGNMENTS ---------------- */
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("questions", "title difficulty")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};

/* ---------------- GET ASSIGNMENT BY ID ---------------- */
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("questions")
      .populate("createdBy", "name email");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assignment" });
  }
};

exports.getAssignmentforStudent = async (req, res) => {
  try {
    const studentId = req.body.studentId;
    const student = await User.findById(studentId);
    console.log(studentId);
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const assignmentIds = student.assignments || [];
    const assignments = await Assignment.find({ _id: { $in: assignmentIds } })
      .populate("questions", "title difficulty")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: "Failed to fetch assignments for student" });
  } 
};

/* ---------------- UPDATE ASSIGNMENT ---------------- */
exports.updateAssignment = async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update assignment" });
  }
};

/* ---------------- DELETE ASSIGNMENT ---------------- */
exports.deleteAssignment = async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete assignment" });
  }
};
