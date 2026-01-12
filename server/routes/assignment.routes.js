const express = require("express");
const router = express.Router();

const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
} = require("../controllers/assignment.controller");

const authMiddleware = require("../middleware/auth.middleware");

/* ----------- ADMIN / FACULTY ----------- */
router.post("/", createAssignment);
router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

/* ----------- COMMON ----------- */
router.get("/", getAllAssignments);
router.get("/:id", getAssignmentById);

module.exports = router;
