const Submission = require("../models/Submission");
const User = require("../models/User");
const { getQuestionTitleById } = require("./question.controller");

/**
 * SINGLE API
 * - Student-wise completed count
 * - Student submissions
 * - Submission code
 */
exports.batchSubmissionReport = async (req, res) => {
  const { college, year, batch, studentId, submissionId } = req.body;

  try {
    if (submissionId) {
      const submission = await Submission.findById(submissionId).select(
        "code language"
      );

      return res.json(submission);
    }
    if (studentId) {
      const submissions = await Submission.find({ studentId }).lean();

      const questionTitleMap = {};

      await Promise.all(
        submissions.map(async s => {
          if (!questionTitleMap[s.questionId]) {
            questionTitleMap[s.questionId] =
              await getQuestionTitleById(s.questionId);
          }
        })
      );

      const result = submissions.map(s => ({
        _id: s._id,
        questionTitle: questionTitleMap[s.questionId],
        verdict: s.verdict,
        createdAt: s.createdAt
      }));

      return res.json(result);
    }

    if (!college || !year || !batch) {
      return res.status(400).json({
        message: "college, year, and batch are required"
      });
    }

    const stats = await Submission.aggregate([
      {
        $match: {
          college,
          year,
          batch,
          verdict: "AC"
        }
      },
      {
        $group: {
          _id: {
            studentId: "$studentId",
            questionId: "$questionId"
          }
        }
      },
      {
        $group: {
          _id: "$_id.studentId",
          completedCount: { $sum: 1 }
        }
      }
    ]);

    const studentIds = stats.map(s => s._id);

    const students = await User.find({
      _id: { $in: studentIds }
    })
      .select("name email")
      .lean();

    const studentMap = {};
    students.forEach(s => {
      studentMap[s._id.toString()] = s;
    });

    const result = stats.map(s => ({
      studentId: s._id,
      completedCount: s.completedCount,
      student: studentMap[s._id] || null
    }));

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
