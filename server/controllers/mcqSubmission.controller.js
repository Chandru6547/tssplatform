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
