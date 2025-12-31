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
module.exports = router;
