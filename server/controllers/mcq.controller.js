const MCQ = require("../models/MCQ");
const fetchStudent =  require("./judge.controller").getStudentDetails;
const logger = require("../utils/logger");

/* ---------- CREATE MCQ ---------- */
exports.createMCQ = async (req, res) => {
  logger.info("createMCQ API called");
  try {
    const mcq = await MCQ.create(req.body);
    logger.success("MCQ created successfully");
    res.status(201).json(mcq);
  } catch (err) {
    logger.error("Error in createMCQ: " + err.message);
    res.status(400).json({ error: err.message });
  }
};

/* ---------- GET ALL MCQS ---------- */
exports.getAllMCQs = async (req, res) => {
  logger.info("getAllMCQs API called");
  try {
    const mcqs = await MCQ.find();
    console.log(mcqs);
    logger.success("All MCQs retrieved successfully");
    res.json(mcqs);
  } catch (err) {
    logger.error("Error in getAllMCQs: " + err.message);
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllMCQsforAdmin = async (req, res) => {
  logger.info("getAllMCQsforAdmin API called");
  try {
    const mcqs = await MCQ.find();
    console.log(mcqs);
    logger.success("All MCQs for admin retrieved successfully");
    res.send(mcqs);
  } catch (err) {
    logger.error("Error in getAllMCQsforAdmin: " + err.message);
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getMcqsForStudent = async (req, res) => {
  logger.info("getMcqsForStudent API called");
  try {
    const { studentId } = req.body;
    console.log(studentId);
    
    const Student = require("../models/User");

    const student = await Student.findById(studentId);
    if (!student) {
      logger.error("Student not found in getMcqsForStudent");
      return res.status(404).json({ message: "Student not found" });
    }
    
    const mcqIds = student.mcqs || [];

    const mcqs = await MCQ.find({ _id: { $in: mcqIds } });
    logger.success("MCQs for student retrieved successfully");
    res.json(mcqs);
  } catch (err) {
    logger.error("Error in getMcqsForStudent: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

  exports.getMcqsDetailForStudent = async (req, res) => {
    logger.info("getMcqsDetailForStudent API called");
    try {
      const { studentId } = req.body;
      console.log(studentId);

      const Student = require("../models/User");
      
      const student = await Student.findById(studentId);
      if (!student) {
        logger.error("Student not found in getMcqsDetailForStudent");
        return res.status(404).json({ message: "Student not found" });
      }
      const mcqIds = student.mcqs || [];
      const mcqs = await MCQ.find({ _id: { $in: mcqIds } });
      logger.success("MCQs details for student retrieved successfully");
      res.json(mcqs);
    } catch (err) {
      logger.error("Error in getMcqsDetailForStudent: " + err.message);
      res.status(500).json({ error: err.message });
    }
  };

exports.getMCQByID = async (req, res) => {
  logger.info("getMCQByID API called");
  try {
    const mcq = await MCQ.findById(req.params.id);
    logger.success("MCQ by ID retrieved successfully");
    res.json(mcq);
  } catch (err) {
    logger.error("Error in getMCQByID: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getMCQByIDHelper = async (id) => {
  logger.info("getMCQByIDHelper called");
  try {
    const mcq = await MCQ.findById(id);
    logger.success("MCQ by ID helper retrieved successfully");
    res.json(mcq);
  } catch (err) {
    logger.error("Error in getMCQByIDHelper: " + err.message);
    res.status(500).json({ error: err.message });
  }
}

/* ---------- GET MCQS BY CATEGORY ---------- */
exports.getMCQsByCategory = async (req, res) => {
  logger.info("getMCQsByCategory API called");
  try {
    const { category } = req.query;
    const mcqs = await MCQ.find({ category });
    logger.success("MCQs by category retrieved successfully");
    res.json(mcqs);
  } catch (err) {
    logger.error("Error in getMCQsByCategory: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ---------- GET MCQS BY TOPIC ---------- */
exports.getMCQsByTopic = async (req, res) => {
  logger.info("getMCQsByTopic API called");
  try {
    const { topic } = req.query;
    const mcqs = await MCQ.find({ topic });
    logger.success("MCQs by topic retrieved successfully");
    res.json(mcqs);
  } catch (err) {
    logger.error("Error in getMCQsByTopic: " + err.message);
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
};

/* ---------- DELETE MCQ ---------- */
exports.deleteMCQ = async (req, res) => {
  logger.info("deleteMCQ API called");
  try {
    await MCQ.findByIdAndDelete(req.params.id);
    logger.success("MCQ deleted successfully");
    res.json({ message: "MCQ deleted successfully" });
  } catch (err) {
    logger.error("Error in deleteMCQ: " + err.message);
    res.status(400).json({ error: err.message });
  }
};
