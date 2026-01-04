const express = require("express");
const router = express.Router();
const mcqController = require("../controllers/mcq.controller");

router.post("/createmcq", mcqController.createMCQ);
router.post("/getallmcq", mcqController.getAllMCQs);
router.get("/category", mcqController.getMCQsByCategory);
router.get("/topic", mcqController.getMCQsByTopic);
router.delete("/:id", mcqController.deleteMCQ);
router.post("/mcqs-student", mcqController.getMcqsForStudent);
router.get("/:id", mcqController.getMCQByID);

module.exports = router;
