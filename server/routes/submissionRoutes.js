const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { checkSolvedStatus } = require("../controllers/submissionController");

// 🔐 Student/Admin (logged in)
router.get("/solved", auth(["student"]), checkSolvedStatus);
router.get("/getSubmissionbyBatch", auth(["admin"]), require("../controllers/submissionController").getSubmissionsByBatch);

module.exports = router;
