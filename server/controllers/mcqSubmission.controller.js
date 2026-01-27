const MCQ = require("../models/MCQ");
const MCQSubmission = require("../models/MCQSubmission");
const User = require("../models/User");
const logger = require("../utils/logger");

/* ---------- SUBMIT MCQ ---------- */
exports.submitMCQ = async (req, res) => {
  logger.info("submitMCQ API called");
  try {
    const { mcqId, studentId, answers } = req.body;

    console.log(req.body);
    

    const mcq = await MCQ.findById(mcqId);
    if (!mcq) {
      logger.error("MCQ not found in submitMCQ");
      return res.status(404).json({ message: "MCQ not found" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      logger.error("Student not found in submitMCQ");
      return res.status(404).json({ message: "Student not found" });
    }
    console.log(student);
    

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
      answers: evaluatedAnswers,
      isTabSwitch : req.body.forcedSubmit,
      StudentName : student.name
    });

    logger.success("MCQ submitted successfully");
    res.status(201).json({
      message: "MCQ submitted successfully",
      submission
    });
  } catch (err) {
    logger.error("Error in submitMCQ: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ---------- GET SUBMISSIONS BY STUDENT ---------- */
exports.getMCQSubmissionsByStudent = async (req, res) => {
  logger.info("getMCQSubmissionsByStudent API called");
  try {
    const { studentId } = req.params;

    const submissions = await MCQSubmission.find({ studentId })
      .populate("mcqId", "topic category");

    logger.success("MCQ submissions by student retrieved successfully");
    res.json(submissions);
  } catch (err) {
    logger.error("Error in getMCQSubmissionsByStudent: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ---------- GET SUBMISSIONS BY MCQ ---------- */
exports.getMCQSubmissionsByMCQ = async (req, res) => {
  logger.info("getMCQSubmissionsByMCQ API called");
  try {
    const { mcqId } = req.params;

    const submissions = await MCQSubmission.find({ mcqId })
      .populate("studentId", "name email");

    logger.success("MCQ submissions by MCQ retrieved successfully");
    res.json(submissions);
  } catch (err) {
    logger.error("Error in getMCQSubmissionsByMCQ: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

/* ---------- GET SUBMISSION BY STUDENT & MCQ ---------- */
exports.getMCQSubmissionByStudentAndMcq = async (req, res) => {
  logger.info("getMCQSubmissionByStudentAndMcq API called");
  try {
    const { studentId, mcqId } = req.params;

    if (!studentId || !mcqId) {
      logger.error("studentId and mcqId are required in getMCQSubmissionByStudentAndMcq");
      return res.status(400).json({ message: "studentId and mcqId are required" });
    }

    const submissions = await MCQSubmission.find({ studentId, mcqId }).sort({ createdAt: -1 });

    if (!submissions || submissions.length === 0) {
      logger.info("No submissions found for given student and mcq");
      return res.json([]);
    }

    logger.success("Submissions for student and MCQ retrieved successfully");
    res.json(submissions);
  } catch (err) {
    logger.error("Error in getMCQSubmissionByStudentAndMcq: " + err.message);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 
exports.getSubmissionForStudentAndMcq = async (req, res) => {
  logger.info("getMCQSubmissionByStudentAndMcq API called");
  try {
    const { studentId, mcqId } = req.body;  
    if (!studentId || !mcqId) {
      logger.error("studentId and mcqId are required in getMCQSubmissionByStudentAndMcq");
      return res.status(400).json({ message: "studentId and mcqId are required" });
    } 
    const submissions = await MCQSubmission.find({ studentId, mcqId }).sort({ createdAt: -1 });
    if (!submissions || submissions.length === 0) {
      logger.info("No submissions found for given student and mcq");
      return res.json([]);
    }
    logger.success("Submissions for student and MCQ retrieved successfully");
    res.json(submissions);
  } catch (err) {
    logger.error("Error in getMCQSubmissionByStudentAndMcq: " + err.message);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } 
};

exports.getMCQSubmissionbyBatch = async (req, res) => {
  logger.info("getMCQSubmissionbyBatch API called");
  const { college, year, batch, mcqId } = req.body;
  console.log(req.body);
  
  if (!college || !year || !batch) {
    logger.error("college, year, and batch are required in getMCQSubmissionbyBatch");
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
      logger.success("No submissions found for the batch");
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

      console.log(students);

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

    logger.success("MCQ submissions by batch retrieved successfully");
    console.log(enrichedSubmissions);
    res.json(enrichedSubmissions);

  } catch (err) {
    logger.error("Error in getMCQSubmissionbyBatch: " + err.message);
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubmissionByCollegeAndMcq = async (req, res) => {
  logger.info("getSubmissionByCollegeAndMcq API called");
  try {
    const { college, mcqId } = req.body;

    if (!college || !mcqId) {
      logger.error("college and mcqId are required in getSubmissionByCollegeAndMcq");
      return res.status(400).json({ message: "college and mcqId are required" });
    }

    // 1️⃣ Get all students from the college
    const students = await User.find(
      { college, role: "student" },
      { password: 0 }
    );

    logger.info(`Found ${students.length} students in college ${college}`);

    const studentIds = students.map(s => s._id);

    // 2️⃣ Get all MCQ submissions for those students
    const submissions = await MCQSubmission.find({
      mcqId,
      studentId: { $in: studentIds }
    })
      .populate("studentId", "name email regNo batch year")
      .sort({ score: -1, createdAt: 1 }); // leaderboard style

    res.json(submissions);

  } catch (err) {
    logger.error("Failed to fetch MCQ submissions by college", err);
    res.status(500).json({
      message: "Failed to fetch MCQ submissions by college"
    });
  }
};
