require("dotenv").config();

const Submission = require("../models/Submission");
const Question = require("../models/Question");
const User = require("../models/User");
const { executeCode } = require("../services/judge.service");
const logger = require("../utils/logger");

/* ---------------------------------------------
   RUN / SUBMIT CODE CONTROLLER
---------------------------------------------- */
  async function runCodeController(req, res) {
    logger.info("runCodeController API called");
    try {
      const {
        language,
        code,
        testcases,
        questionId,
        studentId
      } = req.body;

      let assignmentId = req.body.assignmentId;

      console.log(req.body);
      

      /* ---------- BASIC VALIDATION ---------- */
      if (!language || !code) {
        logger.error("runCodeController failed: language and code are required");
        return res.status(400).json({
          error: "language and code are required"
        });
      }

      /* ---------- STUDENT DETAILS ---------- */
      const student = await getStudentDetails(studentId);

      /* ---------- MODE FLAGS ---------- */
      let finalTestcases = testcases;
      let isSubmission = false;

      /* ---------- SUBMIT MODE ---------- */
      if (questionId) {
        const question = await Question.findById(questionId);

        if (!question) {
          logger.error("runCodeController failed: Question not found");
          return res.status(404).json({
            error: "Question not found"
          });
        }

        finalTestcases = question.hiddenTestcases;
        isSubmission = true;
      }

      /* ---------- RUN MODE VALIDATION ---------- */
      if (!Array.isArray(finalTestcases)) {
        logger.error("runCodeController failed: testcases[] required");
        return res.status(400).json({
          error: "testcases[] required"
        });
      }

      /* ---------- EXECUTE CODE ---------- */
      const result = await executeCode(
        language,
        code,
        finalTestcases
      );

      /* ---------- SAVE SUBMISSION ---------- */
      let submission = null;

      if (isSubmission) {
        submission = await Submission.create({
          language,
          code,
          questionId,
          verdict: result.verdict,
          passed: result.passed,
          total: result.total,
          results: result.results,

          studentId: studentId || null,
          college: student?.college || "",
          year: student?.year || 0,
          batch: student?.batch || ""
        });
      }

      /* ---------- RESPONSE ---------- */
      logger.success("Code execution completed successfully");
      return res.json({
        submissionId: submission?._id || null,
        verdict: result.verdict,
        passed: result.passed,
        total: result.total,
        results: result.results
      });

    } catch (err) {
      logger.error("runCodeController failed: " + err.message);
      console.error("RUN CODE ERROR:", err);

      return res.status(500).json({
        verdict: err?.type || "ERROR",
        error: err?.message || "Internal Server Error"
      });
    }
  }

async function getStudentDetails(studentId) {
  if (!studentId) return null;

  const student = await User.findById(studentId)
    .select("-password -__v")
    .lean();

  if (!student) return null;
  if (student.role !== "student") return null;

  return student;
}



module.exports = {
  runCodeController,
  getStudentDetails
};