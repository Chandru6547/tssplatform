const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const adminController = require("../controllers/admin.controller");


router.post(
  "/create",
  // auth(["admin"]), // only admin/super admin
  adminController.createAdmin
);

router.post(
  "/create-student",
  // auth(["admin"]), // only admin/super admin
  adminController.createStudent
);

router.post('/filternotcreated', adminController.findNotCreatedStudents);
router.post('/bulkcreatestudent', adminController.bulkCreateStudents);
router.post('/bulkdeletestudents', adminController.bulkDeleteStudentsByEmail);
module.exports = router;
