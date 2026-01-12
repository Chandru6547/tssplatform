const express = require("express");
const router = express.Router();

const {
  submitAssignment,
  getSubmissionsByAssignment,
  getSubmissionByStudent
} = require("../controllers/assignmentSubmission.controller");

const authMiddleware = require("../middleware/auth.middleware");

/* -------- STUDENT -------- */
router.post("/submit", submitAssignment);

/* -------- ADMIN / FACULTY -------- */
router.get(
  "/assignment/:assignmentId",
  getSubmissionsByAssignment
);

/* -------- STUDENT VIEW -------- */
router.get(
  "/assignment/:assignmentId/student/:studentId",
  getSubmissionByStudent
);

module.exports = router;
