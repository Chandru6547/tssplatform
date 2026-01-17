const AssignmentSubmission = require("../models/AssignmentSubmission");
const User = require("../models/User");
const Assignment = require("../models/Assignment");

/* ---------------- SUBMIT ASSIGNMENT ---------------- */
exports.submitAssignment = async (req, res) => {
  try {
    console.log(req.body);
    const { assignmentId, studentId, solvedQuestions, isFinalSubmisison } = req.body;

    if (!assignmentId || !studentId) {
      return res.status(400).json({
        message: "assignmentId and studentId are required"
      });
    }

    const isCompleted = isFinalSubmisison ? true : false;

    /* ---------- FETCH STUDENT ---------- */
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    /* ---------- CHECK ASSIGNMENT ---------- */
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    const problemsSolved = solvedQuestions ? solvedQuestions.length : 0;

    /* ---------- UPSERT SUBMISSION ---------- */
    const submission = await AssignmentSubmission.findOneAndUpdate(
      { assignmentId, studentId },
      {
        assignmentId,
        studentId,
        studentName: student.name,
        rollNo: student.regNo,
        batch: student.batch,
        solvedQuestions: solvedQuestions || [],
        problemsSolved,
        isCompleted
      },
      { new: true, upsert: true }
    );

    res.status(201).json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to submit assignment"
    });
  }
};

/* ---------------- GET SUBMISSIONS BY ASSIGNMENT ---------------- */
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({
      assignmentId: req.params.assignmentId
    }).sort({ problemsSolved: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch submissions"
    });
  }
};

/* ---------------- GET SUBMISSION BY STUDENT ---------------- */
exports.getSubmissionByStudent = async (req, res) => {
  try {
    const submission = await AssignmentSubmission.findOne({
      assignmentId: req.params.assignmentId,
      studentId: req.params.studentId
    }).populate("solvedQuestions", "title difficulty");

    console.log(submission);
    

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found"
      });
    }

    res.json(submission);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch submission"
    });
  }
};
