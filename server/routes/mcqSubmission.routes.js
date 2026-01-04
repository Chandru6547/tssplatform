const express = require("express");
const router = express.Router();
const controller = require("../controllers/mcqSubmission.controller");

router.post("/submit", controller.submitMCQ);
router.get("/student/:studentId", controller.getMCQSubmissionsByStudent);
router.get("/mcq/:mcqId", controller.getMCQSubmissionsByMCQ);
router.post("/getreporbytbatch", controller.getMCQSubmissionbyBatch);
// router.post("/distinct-mcqs", controller.getDistinctMCQsByBatch);

module.exports = router;
