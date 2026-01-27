const Submission = require("../models/Submission");
const getQuestionTitleById = require("./question.controller").getQuestionTitleById;
const User = require("../models/User");
const logger = require("../utils/logger");

exports.checkSolvedStatus = async (req, res) => {
  logger.info("checkSolvedStatus API called");
  const studentId = req.user.userId;
  const { questionId } = req.query;

  if (!questionId) {
    logger.error("questionId is required in checkSolvedStatus");
    return res.status(400).json({ message: "questionId is required" });
  }

  try {
    const solved = await Submission.exists({
      studentId,
      questionId: questionId,
      verdict: "AC"
    });
    
    logger.success("Solved status checked successfully");
    res.json({
      solved: !!solved
    });
  } catch (err) {   
    logger.error("Error in checkSolvedStatus: " + err.message);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubmissionByStudent = async (req, res) => {
  logger.info("getSubmissionByStudent API called");
  const studentId = req.body.studentId;

  try {
    const submissions = await Submission.find({ studentId }).lean();

    logger.success("Submissions retrieved successfully");
    res.json(submissions);
  } catch (err) {
    logger.error("Error in getSubmissionByStudent: " + err.message);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getSubmissionsByBatch = async (req, res) => {
  logger.info("getSubmissionsByBatch API called");
  const { college, year, batch } = req.body;

  if (!college || !year || !batch) {
    logger.error("college, year, and batch are required in getSubmissionsByBatch");
    return res.status(400).json({
      message: "college, year, and batch are required"
    });
  }

  try {
    /* ---------- 1️⃣ FETCH SUBMISSIONS ---------- */
    const submissions = await Submission.find({
      college,
      year,
      batch
    }).lean();

    if (submissions.length === 0) {
      logger.success("No submissions found for the batch");
      return res.json([]);
    }

    /* ---------- 2️⃣ FETCH STUDENTS ---------- */
    const studentIds = [
      ...new Set(submissions.map(s => s.studentId))
    ];

    const students = await User.find({
      _id: { $in: studentIds }
    })
      .select("email name")
      .lean();

    const studentMap = {};
    students.forEach(s => {
      studentMap[s._id.toString()] = s;
    });

    /* ---------- 3️⃣ CALCULATE SOLVED COUNT (AC only, DISTINCT) ---------- */
    const solvedMap = {};

    submissions.forEach(sub => {
      if (sub.verdict === "AC") {
        if (!solvedMap[sub.studentId]) {
          solvedMap[sub.studentId] = new Set();
        }
        solvedMap[sub.studentId].add(sub.questionId);
      }
    });

    // Convert Set size to number
    const solvedCountMap = {};
    Object.keys(solvedMap).forEach(studentId => {
      solvedCountMap[studentId] = solvedMap[studentId].size;
    });

    /* ---------- 4️⃣ FETCH QUESTION TITLES ---------- */
    const questionTitleMap = {};

    await Promise.all(
      submissions.map(async sub => {
        if (!questionTitleMap[sub.questionId]) {
          questionTitleMap[sub.questionId] =
            await getQuestionTitleById(sub.questionId);
        }
      })
    );

    /* ---------- 5️⃣ ENRICH SUBMISSIONS ---------- */
    const enrichedSubmissions = submissions.map(sub => ({
      ...sub,

      // student details
      student: studentMap[sub.studentId] || null,

      // question title
      questionTitle: questionTitleMap[sub.questionId] || "Unknown Question",

      // ✅ NEW: solved count
      studentSolvedCount: solvedCountMap[sub.studentId] || 0
    }));

    logger.success("Submissions by batch retrieved successfully");
    res.json(enrichedSubmissions);

  } catch (err) {
    logger.error("Error in getSubmissionsByBatch: " + err.message);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


