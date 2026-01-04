const MCQ = require("../models/MCQ");
const MCQSubmission = require("../models/MCQSubmission");
const User = require("../models/User");

/* ---------- SUBMIT MCQ ---------- */
exports.submitMCQ = async (req, res) => {
  try {
    const { mcqId, studentId, answers } = req.body;

    const mcq = await MCQ.findById(mcqId);
    if (!mcq) {
      return res.status(404).json({ message: "MCQ not found" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    let score = 0;
    let totalMarks = 0;
    const evaluatedAnswers = [];

    mcq.questions.forEach((q) => {
      const studentAnswer = answers.find(
        a => a.questionId === q._id.toString()
      );

      totalMarks += q.mark || 1;

      if (!studentAnswer) return;

      const isCorrect = studentAnswer.selectedOption === q.correctOption;
      if (isCorrect) score += q.mark || 1;

      evaluatedAnswers.push({
        questionId: q._id,
        selectedOption: studentAnswer.selectedOption,
        correctOption: q.correctOption,
        isCorrect,
        mark: q.mark || 1
      });
    });

    const submission = await MCQSubmission.create({
      mcqId,
      studentId,
      score,
      totalMarks,
      college: student.college,
      year: student.year,
      batch: student.batch,
      answers: evaluatedAnswers
    });

    res.status(201).json({
      message: "MCQ submitted successfully",
      submission
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------- GET SUBMISSIONS BY STUDENT ---------- */
exports.getMCQSubmissionsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const submissions = await MCQSubmission.find({ studentId })
      .populate("mcqId", "topic category");

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------- GET SUBMISSIONS BY MCQ ---------- */
exports.getMCQSubmissionsByMCQ = async (req, res) => {
  try {
    const { mcqId } = req.params;

    const submissions = await MCQSubmission.find({ mcqId })
      .populate("studentId", "name email");

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMCQSubmissionbyBatch = async (req, res) => {
  const { college, year, batch, mcqId } = req.body;
  console.log(req.body);
  
  if (!college || !year || !batch) {
    return res.status(400).json({
      message: "college, year, and batch are required"
    });
  }

  try {
    /* ---------- 1️⃣ FETCH SUBMISSIONS ---------- */
    const allSubmissions = await MCQSubmission.find({
      college,
      year,
      batch,
      mcqId
    }).lean();

    if (allSubmissions.length === 0) {
      return res.json([]);
    }

    /* ---------- 2️⃣ FILTER TO MAX SCORE PER STUDENT PER MCQ ---------- */
    const studentMcqMaxSubmissions = {};
    allSubmissions.forEach(sub => {
      const key = `${sub.studentId}-${sub.mcqId}`;
      if (!studentMcqMaxSubmissions[key] || sub.score > studentMcqMaxSubmissions[key].score) {
        studentMcqMaxSubmissions[key] = sub;
      }
    });
    const submissions = Object.values(studentMcqMaxSubmissions);

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

    /* ---------- 3️⃣ CALCULATE MCQ ATTEMPTED COUNT (DISTINCT) ---------- */
    const attemptedMap = {};

    submissions.forEach(sub => {
      if (!attemptedMap[sub.studentId]) {
        attemptedMap[sub.studentId] = new Set();
      }
      attemptedMap[sub.studentId].add(sub.mcqId);
    });

    // Convert Set size to number
    const attemptedCountMap = {};
    Object.keys(attemptedMap).forEach(studentId => {
      attemptedCountMap[studentId] = attemptedMap[studentId].size;
    });

    /* ---------- 4️⃣ FETCH MCQ TOPICS ---------- */
    const mcqTopicMap = {};

    await Promise.all(
      submissions.map(async sub => {
        if (!mcqTopicMap[sub.mcqId]) {
          const mcq = await MCQ.findById(sub.mcqId).select("topic category");
          mcqTopicMap[sub.mcqId] = mcq ? mcq.topic : "Unknown MCQ";
        }
      })
    );

    /* ---------- 5️⃣ ENRICH SUBMISSIONS ---------- */
    const enrichedSubmissions = submissions.map(sub => ({
      ...sub,

      // student details
      student: studentMap[sub.studentId] || null,

      // mcq topic
      mcqTopic: mcqTopicMap[sub.mcqId] || "Unknown MCQ",

      // ✅ NEW: attempted count
      studentAttemptedCount: attemptedCountMap[sub.studentId] || 0
    }));

    res.json(enrichedSubmissions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
