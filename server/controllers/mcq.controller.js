const MCQ = require("../models/MCQ");
const fetchStudent =  require("./judge.controller").getStudentDetails;

/* ---------- CREATE MCQ ---------- */
exports.createMCQ = async (req, res) => {
  try {
    const mcq = await MCQ.create(req.body);
    res.status(201).json(mcq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ---------- GET ALL MCQS ---------- */
exports.getAllMCQs = async (req, res) => {
  try {
    const mcqs = await MCQ.find();
    console.log(mcqs);
    res.json(mcqs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllMCQsforAdmin = async (req, res) => {
  try {
    const mcqs = await MCQ.find();
    console.log(mcqs);
    res.send(mcqs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getMcqsForStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    console.log(studentId);
    
    const Student = require("../models/User");

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log(student);
    
    const mcqIds = student.mcqs || [];

    const mcqs = await MCQ.find({ _id: { $in: mcqIds } });
    res.json(mcqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMCQByID = async (req, res) => {
  try {
    const mcq = await MCQ.findById(req.params.id);
    res.json(mcq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMCQByIDHelper = async (id) => {
    try {
    const mcq = await MCQ.findById(id);
    res.json(mcq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* ---------- GET MCQS BY CATEGORY ---------- */
exports.getMCQsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const mcqs = await MCQ.find({ category });
    res.json(mcqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------- GET MCQS BY TOPIC ---------- */
exports.getMCQsByTopic = async (req, res) => {
  try {
    const { topic } = req.query;
    const mcqs = await MCQ.find({ topic });
    res.json(mcqs);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
};

/* ---------- DELETE MCQ ---------- */
exports.deleteMCQ = async (req, res) => {
  try {
    await MCQ.findByIdAndDelete(req.params.id);
    res.json({ message: "MCQ deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
