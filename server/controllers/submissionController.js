const Submission = require("../models/Submission");
const getQuestionTitleById = require("./question.controller").getQuestionTitleById;
const User = require("../models/User");

exports.checkSolvedStatus = async (req, res) => {
  const studentId = req.user.userId;
  const { questionId } = req.query;

  if (!questionId) {
    return res.status(400).json({ message: "questionId is required" });
  }

  try {
    const solved = await Submission.exists({
      studentId,
      questionId: questionId,
      verdict: "AC"
    });
    
    res.json({
      solved: !!solved
    });
  } catch (err) {   
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubmissionsByBatch = async (req, res) => {
  const { college, year, batch } = req.body;

  if (!college || !year || !batch) {
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

    res.json(enrichedSubmissions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
